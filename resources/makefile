ENV ?= dev
AWS_PROFILE ?= default

deploy:
	aws cloudformation deploy --capabilities CAPABILITY_NAMED_IAM --template-file resources.yaml --stack-name incidenthub-$(ENV) --profile $(AWS_PROFILE)

deployApp:
	aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://resources.json --parameters file://parameters.json --stack-name=incident-hub-app
# uploadLambda:
# 	aws lambda update-function-code --profile $(AWS_PROFILE) --function-name xws-$(ENV)-process-alert --zip-file "fileb://./process-alert/function.zip"

delete:
	aws cloudformation delete-stack --stack-name incidenthub-$(ENV) --profile $(AWS_PROFILE)

echo:
	echo $(ENV)