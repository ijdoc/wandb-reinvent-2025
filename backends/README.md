# Serverless Cloud Functions with Pulumi

This template demonstrates how to deploy serverless functions to AWS, GCP, and Azure, and trigger on-prem workloads using Pulumi.

## Prerequisites
1. Install [pulumi](https://www.pulumi.com/docs/iac/download-install/)
2. Configure your cloud provider credentials.

## Deploying
- Navigate to the desired directory (`aws/`, `gcp/`, `azure/`, or `onprem/`).
- Install dependencies: `pip install -r requirements.txt`.
- Deploy: `pulumi up`.
