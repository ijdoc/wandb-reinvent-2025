"""An AWS Python Pulumi program"""

import iam
import pulumi
import pulumi_aws as aws

region = aws.config.region

custom_stage_name = "example"

##################
## Lambda Function
##################

# Create a Lambda function, using code from the `./lambda` folder.
lambda_func = aws.lambda_.Function(
    "wandb-pml-lambda",
    role=iam.lambda_role.arn,
    runtime="python3.9",
    handler="main.handler",
    code=pulumi.AssetArchive({".": pulumi.FileArchive("./lambda")}),
)


#########################################################################
# Create an HTTP API and attach the lambda function to it
##    /{proxy+} - passes all requests through to the lambda function
##
#########################################################################

http_endpoint = aws.apigatewayv2.Api(
    "http-api-pulumi-example",
    protocol_type="HTTP",
    cors_configuration=aws.apigatewayv2.ApiCorsConfigurationArgs(
        allow_origins=[
            "http://localhost:5173",
            "https://storage.googleapis.com",
        ],  # Allow Vite app origin
        allow_methods=[
            "POST",
        ],  # Allow all necessary HTTP methods
        allow_headers=["Content-Type", "Authorization"],  # Allow common headers
        expose_headers=["Content-Type", "Authorization"],  # Expose headers for client
        max_age=86400,  # Cache CORS preflight responses for 1 day
    ),
)

http_lambda_backend = aws.apigatewayv2.Integration(
    "example",
    api_id=http_endpoint.id,
    integration_type="AWS_PROXY",
    connection_type="INTERNET",
    description="Lambda example",
    integration_method="POST",
    integration_uri=lambda_func.arn,
    passthrough_behavior="WHEN_NO_MATCH",
)

url = http_lambda_backend.integration_uri

http_route = aws.apigatewayv2.Route(
    "example-route",
    api_id=http_endpoint.id,
    route_key="ANY /{proxy+}",
    target=http_lambda_backend.id.apply(lambda targetUrl: "integrations/" + targetUrl),
)

http_stage = aws.apigatewayv2.Stage(
    "example-stage",
    api_id=http_endpoint.id,
    route_settings=[
        {
            "route_key": http_route.route_key,
            "throttling_burst_limit": 1,
            "throttling_rate_limit": 0.5,
        }
    ],
    auto_deploy=True,
)

# Give permissions from API Gateway to invoke the Lambda
http_invoke_permission = aws.lambda_.Permission(
    "api-http-lambda-permission",
    action="lambda:invokeFunction",
    function=lambda_func.name,
    principal="apigateway.amazonaws.com",
    source_arn=http_endpoint.execution_arn.apply(lambda arn: arn + "*/*"),
)

# See "Outputs" for (Inputs and Outputs)[https://www.pulumi.com/docs/intro/concepts/inputs-outputs/] the usage of the pulumi.Output.all function to do string concatenation
pulumi.export(
    "apigatewayv2-http-endpoint",
    pulumi.Output.all(http_endpoint.api_endpoint, http_stage.name).apply(
        lambda values: values[0] + "/" + values[1] + "/"
    ),
)
