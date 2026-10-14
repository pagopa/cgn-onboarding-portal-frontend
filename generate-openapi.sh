#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Set the API version tag (default: master)
VERSION_TAG="${1:-master}"

# Define the base GitHub URL
BASE_URL="https://raw.githubusercontent.com/pagopa/cgn-onboarding-portal-backend/${VERSION_TAG}/openapi"

echo "📥 Downloading OpenAPI specifications (version: ${VERSION_TAG})..."
curl -s "${BASE_URL}/openapi.yaml" -o ./src/api/api.yaml
curl -s "${BASE_URL}/backoffice/openapi.yaml" -o ./src/api/api_backoffice.yaml
curl -s "${BASE_URL}/public.yaml" -o ./src/api/api_public.yaml

echo "⚙️ Generating API clients..."
openapi-generator-cli generate -i ./src/api/api.yaml -g typescript-axios -o ./src/api/generated --additional-properties useSingleRequestParameter=true
openapi-generator-cli generate -i ./src/api/api_backoffice.yaml -g typescript-axios -o ./src/api/generated_backoffice --additional-properties useSingleRequestParameter=true
openapi-generator-cli generate -i ./src/api/api_public.yaml -g typescript-axios -o ./src/api/generated_public --additional-properties useSingleRequestParameter=true

echo "✅ All OpenAPI specs downloaded and API clients generated successfully (version: ${VERSION_TAG})."