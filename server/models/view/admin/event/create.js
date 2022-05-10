const joi = require('joi')
const { BaseViewModel, baseMessages } = require('../../form')
const { countries, regions, themes } = require('../../../../data')
const dbMapper = rec => ({ value: rec.id, text: rec.name })

const PAGE_HEADING = 'New event'

const GROUP_KEY = 'groupId'
const GROUP_LABEL = 'Group'

const TITLE_KEY = 'title'
const TITLE_LABEL = 'Title'
const TITLE_MESSAGES = {
  'string.empty': 'Enter a title'
}

const DESCRIPTION_KEY = 'description'
const DESCRIPTION_LABEL = 'Description'
const DESCRIPTION_MAX_LENGTH = 1000
const DESCRIPTION_MESSAGES = {
  'string.empty': 'Enter a description'
}

const DATE_TIME_KEY = 'date'
const DATE_TIME_LABEL = 'Date and Time'
const DATE_TIME_MESSAGES = {
  'string.empty': 'Enter a date and time'
}

const COUNTRY_KEY = 'countryId'
const COUNTRY_LABEL = 'Country'
const COUNTRY_MESSAGES = {
  'any.only': 'Choose a country',
  'string.empty': 'Choose a country'
}
const COUNTRY_OPTIONS = countries.map(dbMapper)

const REGION_KEY = 'regionId'
const REGION_LABEL = 'Region'
const REGION_MESSAGES = {
  'any.only': 'Choose a region',
  'string.empty': 'Choose a region'
}
const REGION_OPTIONS = regions.map(dbMapper)

const SOURCE_KEY = 'source'
const SOURCE_LABEL = 'Source'
const SOURCE_MESSAGES = {
  'any.required': 'Choose an source'
}
const SOURCE_OPTIONS = [
  {
    value: 'single',
    text: 'Single',
    hint: { text: 'From a single source of information' }
  },
  {
    value: 'multiple',
    text: 'Multiple',
    hint: { text: 'From multiple sources of information' }
  }
]

const SOURCE_CLASSIFICATION_KEY = 'sourceClassification'
const SOURCE_CLASSIFICATION_LABEL = 'Source classification'
const SOURCE_CLASSIFICATION_MESSAGES = {
  'any.required': 'Choose an source classification'
}
const SOURCE_CLASSIFICATION_OPTIONS = [
  {
    value: 'opensource',
    text: 'Open source',
    hint: { text: 'From publicly available sources' }
  },
  {
    value: 'official',
    text: 'Official',
    hint: { text: 'From official sources, and has been corroborated by other open sources' }
  }
]

const CAVEATS_KEY = 'caveats'
const CAVEATS_LABEL = 'Caveats'
const CAVEATS_MAX_LENGTH = 1000

const IMPACT_RATING_KEY = 'impactRating'
const IMPACT_RATING_LABEL = 'Impact rating'
const IMPACT_RATING_MESSAGES = {
  'any.required': 'Choose an impact rating'
}
const IMPACT_RATING_OPTIONS = [
  {
    value: 'low',
    text: 'Low'
  },
  {
    value: 'medium',
    text: 'Medium'
  },
  {
    value: 'high',
    text: 'High'
  }
]

const THEMES_KEY = 'themes'
const THEMES_LABEL = 'Themes'
const THEMES_OPTIONS = themes.map(dbMapper)

const schema = joi.object().keys({
  [GROUP_KEY]: joi.string().guid().empty('').allow('').label(GROUP_LABEL),
  [TITLE_KEY]: joi.string().max(70).label(TITLE_LABEL)
    .trim().required().messages(TITLE_MESSAGES),
  [DESCRIPTION_KEY]: joi.string().max(DESCRIPTION_MAX_LENGTH).label(DESCRIPTION_LABEL)
    .trim().required().messages(DESCRIPTION_MESSAGES),
  [DATE_TIME_KEY]: joi.string().label(DATE_TIME_LABEL).required().messages(DATE_TIME_MESSAGES),
  [COUNTRY_KEY]: joi.string().valid(...COUNTRY_OPTIONS.map(item => item.value))
    .label(COUNTRY_LABEL).required().messages(COUNTRY_MESSAGES),
  [REGION_KEY]: joi.string().valid(...REGION_OPTIONS.map(item => item.value))
    .label(REGION_LABEL).required().messages(REGION_MESSAGES),
  [SOURCE_KEY]: joi.string().valid(...SOURCE_OPTIONS.map(item => item.value))
    .label(SOURCE_LABEL).required().messages(SOURCE_MESSAGES),
  [SOURCE_CLASSIFICATION_KEY]: joi.string().valid(...SOURCE_CLASSIFICATION_OPTIONS.map(item => item.value))
    .label(SOURCE_CLASSIFICATION_LABEL).required().messages(SOURCE_CLASSIFICATION_MESSAGES),
  [CAVEATS_KEY]: joi.string().max(CAVEATS_MAX_LENGTH).required().allow('').label(CAVEATS_LABEL).trim(),
  [IMPACT_RATING_KEY]: joi.string().valid(...IMPACT_RATING_OPTIONS.map(item => item.value))
    .label(IMPACT_RATING_LABEL).required().messages(IMPACT_RATING_MESSAGES),
  [THEMES_KEY]: joi.array().items(joi.string().valid(...THEMES_OPTIONS.map(item => item.value)))
    .label(THEMES_LABEL).default([]).single()
}).messages(baseMessages).required()

class ViewModel extends BaseViewModel {
  constructor (data, err, { groups }) {
    super(data, err, {
      pageHeading: PAGE_HEADING,
      path: '/admin/event/create'
    })

    const groupOptions = groups.map(({ id: value, name: text }) => ({ value, text }))
    this.addField(GROUP_KEY, {
      name: GROUP_KEY,
      id: GROUP_KEY,
      label: { text: GROUP_LABEL, classes: 'govuk-label--s' },
      items: [].concat({ text: '' }, groupOptions).map(optionMapper(this.data[GROUP_KEY])),
      value: this.data[GROUP_KEY],
      errorMessage: this.errors[GROUP_KEY]
    })

    this.addField(TITLE_KEY, {
      id: TITLE_KEY,
      name: TITLE_KEY,
      label: { text: TITLE_LABEL, classes: 'govuk-label--s' },
      value: this.data[TITLE_KEY],
      errorMessage: this.errors[TITLE_KEY]
    })

    this.addField(DESCRIPTION_KEY, {
      id: DESCRIPTION_KEY,
      name: DESCRIPTION_KEY,
      label: { text: DESCRIPTION_LABEL, classes: 'govuk-label--s' },
      maxlength: DESCRIPTION_MAX_LENGTH,
      value: this.data[DESCRIPTION_KEY],
      errorMessage: this.errors[DESCRIPTION_KEY]
    })

    this.addField(DATE_TIME_KEY, {
      name: DATE_TIME_KEY,
      id: DATE_TIME_KEY,
      type: 'datetime-local',
      classes: 'govuk-input--width-10',
      label: { text: DATE_TIME_LABEL, classes: 'govuk-label--s' },
      value: this.data[DATE_TIME_KEY],
      errorMessage: this.errors[DATE_TIME_KEY]
    })

    this.addField(COUNTRY_KEY, {
      name: COUNTRY_KEY,
      id: COUNTRY_KEY,
      label: { text: COUNTRY_LABEL, classes: 'govuk-label--s' },
      items: [].concat({ text: '' }, COUNTRY_OPTIONS).map(optionMapper(this.data[COUNTRY_KEY])),
      value: this.data[COUNTRY_KEY],
      errorMessage: this.errors[COUNTRY_KEY]
    })

    this.addField(REGION_KEY, {
      name: REGION_KEY,
      id: REGION_KEY,
      label: { text: REGION_LABEL, classes: 'govuk-label--s' },
      items: [].concat({ text: '' }, REGION_OPTIONS).map(optionMapper(this.data[REGION_KEY])),
      value: this.data[REGION_KEY],
      errorMessage: this.errors[REGION_KEY]
    })

    this.addField(SOURCE_KEY, {
      name: SOURCE_KEY,
      id: SOURCE_KEY,
      classes: 'govuk-radios--inline',
      fieldset: { legend: { text: SOURCE_LABEL, classes: 'govuk-fieldset__legend--m' } },
      items: SOURCE_OPTIONS.map(optionMapper(this.data[SOURCE_KEY], 'checked')),
      value: this.data[SOURCE_KEY],
      errorMessage: this.errors[SOURCE_KEY]
    })

    this.addField(SOURCE_CLASSIFICATION_KEY, {
      name: SOURCE_CLASSIFICATION_KEY,
      id: SOURCE_CLASSIFICATION_KEY,
      classes: 'govuk-radios--inline',
      fieldset: { legend: { text: SOURCE_CLASSIFICATION_LABEL, classes: 'govuk-fieldset__legend--s' } },
      items: SOURCE_CLASSIFICATION_OPTIONS.map(optionMapper(this.data[SOURCE_CLASSIFICATION_KEY], 'checked')),
      value: this.data[SOURCE_CLASSIFICATION_KEY],
      errorMessage: this.errors[SOURCE_CLASSIFICATION_KEY]
    })

    this.addField(CAVEATS_KEY, {
      name: CAVEATS_KEY,
      id: CAVEATS_KEY,
      maxlength: CAVEATS_MAX_LENGTH,
      label: { text: `${CAVEATS_LABEL} (optional)`, classes: 'govuk-label--s' },
      value: this.data[CAVEATS_KEY],
      errorMessage: this.errors[CAVEATS_KEY]
    })

    this.addField(IMPACT_RATING_KEY, {
      name: IMPACT_RATING_KEY,
      id: IMPACT_RATING_KEY,
      fieldset: { legend: { text: IMPACT_RATING_LABEL, classes: 'govuk-label--s' } },
      items: IMPACT_RATING_OPTIONS.map(optionMapper(this.data[IMPACT_RATING_KEY], 'checked')),
      value: this.data[IMPACT_RATING_KEY],
      errorMessage: this.errors[IMPACT_RATING_KEY]
    })

    this.addField(THEMES_KEY, {
      name: THEMES_KEY,
      id: THEMES_KEY,
      fieldset: { legend: { text: THEMES_LABEL, classes: 'govuk-label--s' } },
      items: THEMES_OPTIONS.map(optionMapper(this.data[THEMES_KEY], 'checked', arrayCompare)),
      value: this.data[THEMES_KEY],
      errorMessage: this.errors[THEMES_KEY]
    })
  }
}

const defaultCompare = (item, value) => item.value === value
const arrayCompare = (item, value) => Array.isArray(value)
  ? value.includes(item.value)
  : defaultCompare(item, value)
const optionMapper = (value, prop = 'selected', compare = defaultCompare) => item => {
  return {
    value: item.value,
    text: item.text,
    [prop]: compare(item, value),
    hint: item.hint
  }
}

module.exports = {
  schema,
  ViewModel,
  TITLE_KEY
}
