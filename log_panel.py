import wandb

# Initialize a new run
with wandb.init(
    config={"panel": "bot-qa"},
    job_type="log-panel",
    project="llm-e2e-aws-models-weave",
    entity="team-jdoc",
) as run:
    # Log a metric
    wandb.log(
        {
            "pupilot_tester": wandb.Html(
                open(f"./panels/{run.config["panel"]}/dist/index.html"), inject=False
            )
        }
    )
