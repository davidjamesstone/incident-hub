ENV ?= dev
AWS_PROFILE ?= default

deployVPC:
	aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://vpc.yml --parameters file://vpc.parameters.yml --stack-name=incident-hub-vpc-$(ENV)

deployDB:
	aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://db.yml --parameters file://db.parameters.yml --stack-name=incident-hub-db-$(ENV)

deployS3:
	aws cloudformation create-stack --template-body file://s3.yml --stack-name incident-hub-files-$(ENV)

deployEB:
	aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://eb.yml --parameters file://eb.parameters.yml --stack-name=incident-hub-web-$(ENV)

# uploadLambda:
# 	aws lambda update-function-code --profile $(AWS_PROFILE) --function-name xws-$(ENV)-process-alert --zip-file "fileb://./process-alert/function.zip"

echo:
	echo $(ENV)