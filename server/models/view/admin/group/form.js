const joi = require('joi')
const { BaseViewModel, baseMessages } = require('../../base')

const NAME_KEY = 'name'
const NAME_LABEL = 'Name'
const NAME_MAX_LENGTH = 100
const NAME_MESSAGES = {
  'string.empty': 'Enter a name'
}

const DESCRIPTION_KEY = 'description'
const DESCRIPTION_LABEL = 'Description'
const DESCRIPTION_MAX_LENGTH = 300
const DESCRIPTION_MESSAGES = {
  'string.empty': 'Enter a description'
}

const SUMMARY_KEY = 'summary'
const SUMMARY_LABEL = 'Summary'
const SUMMARY_MAX_LENGTH = 1000
const SUMMARY_MESSAGES = {
  'string.empty': 'Enter a summary'
}

const schema = joi.object().keys({
  [NAME_KEY]: joi.string().max(NAME_MAX_LENGTH).max(70).label(NAME_LABEL)
    .trim().required().messages(NAME_MESSAGES),
  [DESCRIPTION_KEY]: joi.string().max(DESCRIPTION_MAX_LENGTH).label(DESCRIPTION_LABEL)
    .trim().required().messages(DESCRIPTION_MESSAGES),
  [SUMMARY_KEY]: joi.string().max(SUMMARY_MAX_LENGTH).label(SUMMARY_LABEL)
    .trim().required().messages(SUMMARY_MESSAGES)
}).messages(baseMessages).required()

class ViewModel extends BaseViewModel {
  constructor (data, err, options) {
    super(data, err, options)

    this.addField(NAME_KEY, {
      id: NAME_KEY,
      name: NAME_KEY,
      label: { text: NAME_LABEL, classes: 'govuk-label--s' },
      maxlength: NAME_MAX_LENGTH,
      value: this.data[NAME_KEY],
      errorMessage: this.errors[NAME_KEY]
    })

    this.addField(DESCRIPTION_KEY, {
      id: DESCRIPTION_KEY,
      name: DESCRIPTION_KEY,
      label: { text: DESCRIPTION_LABEL, classes: 'govuk-label--s' },
      maxlength: DESCRIPTION_MAX_LENGTH,
      value: this.data[DESCRIPTION_KEY],
      errorMessage: this.errors[DESCRIPTION_KEY]
    })

    this.addField(SUMMARY_KEY, {
      id: SUMMARY_KEY,
      name: SUMMARY_KEY,
      label: { text: SUMMARY_LABEL, classes: 'govuk-label--s' },
      maxlength: SUMMARY_MAX_LENGTH,
      value: this.data[SUMMARY_KEY],
      errorMessage: this.errors[SUMMARY_KEY]
    })
  }
}

class CreateViewModel extends ViewModel {
  constructor (data, err) {
    super(data, err, {
      pageHeading: 'Create group'
    })
  }
}

class EditViewModel extends ViewModel {
  constructor (data, err) {
    super(data, err, {
      pageHeading: 'Edit group'
    })
  }
}

module.exports = {
  schema,
  CreateViewModel,
  EditViewModel
}
