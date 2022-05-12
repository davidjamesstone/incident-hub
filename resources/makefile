ENV ?= dev
AWS_PROFILE ?= default

deploy:
	aws cloudformation deploy --capabilities CAPABILITY_NAMED_IAM --template-file resources.yaml --stack-name incidenthub-$(ENV) --profile $(AWS_PROFILE)

deployVPC:
	aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://vpc.yml --parameters file://vpc.parameters.yml --stack-name=incident-hub-vpc-$(ENV)

deployApp:
	aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://resources.json --parameters file://parameters.json --stack-name=incident-hub-app

deployDB:
	aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://db.yml --parameters file://db.parameters.yml --stack-name=incident-hub-db-$(ENV)

deployS3:
	aws cloudformation create-stack --template-body file://s3.yml --stack-name incident-hub-files-$(ENV)

deployEB:
	aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://eb.yml --parameters file://eb.parameters.yml --stack-name=incident-hub-web-$(ENV)

# uploadLambda:
# 	aws lambda update-function-code --profile $(AWS_PROFILE) --function-name xws-$(ENV)-process-alert --zip-file "fileb://./process-alert/function.zip"

delete:
	aws cloudformation delete-stack --stack-name incidenthub-$(ENV) --profile $(AWS_PROFILE)

echo:
	echo $(ENV)