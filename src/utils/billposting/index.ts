import { format, parse, parseISO, subMonths } from 'date-fns'

import {
  ClassDrawerFormFieldsProps,
  DepartmentDrawerFormFieldsProps,
  LocationDrawerFormFieldsProps,
  ProjectDrawerFormFieldsProps,
} from '@/models/formFields'
import { Toast } from 'pq-ap-lib'
import { roundUp } from '..'

export const verifyAllFieldsValues = (
  formFields:
    | ProfileFormFieldsProps
    | SignInFormFieldsProps
    | ForgotPasswordFormFieldsProps
    | SetPasswordFormFieldsProps
    | ClassDrawerFormFieldsProps
    | DepartmentDrawerFormFieldsProps
    | LocationDrawerFormFieldsProps
    | ProjectDrawerFormFieldsProps
    | { [x: string]: string | number | null }
) => {
  let hasFieldsError: any = {}
  formFields &&
    Object.entries(formFields).forEach(([key, value]) => {
      if (value === null || (typeof value === 'string' && value.trim().length === 0) || value === 0 || value === '0') {
        hasFieldsError = { ...hasFieldsError, [key]: true }
      } else {
        hasFieldsError = { ...hasFieldsError, [key]: false }
      }
    })
  return hasFieldsError
}

export const validate = ({ ...hasFormFieldLibraryErrors }) => {
  if (Object.entries(hasFormFieldLibraryErrors).every(([key, value]) => value === true || key === 'Index')) {
    return true
  } else {
    return false
  }
}

const firstDayOfPreviousMonth = subMonths(new Date(), 1)
const formattedDate = format(firstDayOfPreviousMonth, 'MM/dd/yyyy')
const formattedCurrentDate = format(new Date(), 'MM/dd/yyyy')


const billStatusEditable = [1, 2, 5, 6, 8]

function limitString(str: string, limit: number) {
  if (str.length <= limit) {
    return str
  } else {
    return str.substring(0, limit) + '...'
  }
}

function convertUTCtoLocal(utcTimeString: string) {
  const date = parseISO(utcTimeString)

  const localDateString = format(date, 'MM/dd/yyyy, HH:mm:ss')

  return localDateString
}

const convertFractionToRoundValue = (value: any) => {
  let roundedRes = Math.round(parseFloat(value) * 100) / 100
  return String(roundedRes).slice(0, 13)
}


const getRoundValue = (amount: number) => {
  let roundedAmount = Math.round(amount * 100) / 100
  if (isNaN(roundedAmount)) {
    roundedAmount = 0
  }
  return roundedAmount
}

const getUpdatedDataFromDetailsResponse = (
  data: any,
  keyValueMainFieldObj: any,
  keyValueLineItemFieldObj: any,
  mainFieldListOptions: any,
  generateLinetItemFieldsErrorObj: any
) => {
  let updatedDataObj: any = {}
  let updatedDataErrorObj: any = {}
  let newLineItems: any = []
  let newLineItemsErrorObj: any = []

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      const filterObject = keyValueMainFieldObj.find((d: any) => d.value === key)

      if (!filterObject) {
        continue
      }

      const currentDate = new Date()
      if (filterObject) {
        updatedDataObj = {
          ...updatedDataObj,
          [filterObject?.key]:
            filterObject?.key === 'date'
              ? data?.BillDate
                ? format(data?.BillDate, 'MM/dd/yyyy')
                : format(currentDate, 'MM/dd/yyyy')
              : filterObject?.key === 'duedate'
                ? data?.DueDate
                  ? format(data?.DueDate, 'MM/dd/yyyy')
                  : format(currentDate, 'MM/dd/yyyy')
                : filterObject?.key === 'glPostingDate'
                  ? data?.GLPostingDate
                    ? format(data?.GLPostingDate, 'MM/dd/yyyy')
                    : format(currentDate, 'MM/dd/yyyy')
                  : (filterObject.mappedWith === 2 || filterObject.mappedWith === 3 || filterObject.mappedWith === 14 || filterObject.mappedWith === 15) && data['VendorId']
                    ? data['VendorId']
                    : value,
        }

        const filteredMainFieldObj = mainFieldListOptions?.find((field: any) => field.Name === filterObject.key)

        if (filteredMainFieldObj?.IsRequired) {
          updatedDataErrorObj = {
            ...updatedDataErrorObj,
            [filterObject.key]: value
              ? true
              : filterObject?.key === 'date' || filterObject?.key === 'duedate' || filterObject?.key === 'glPostingDate'
                ? true
                : (filterObject.mappedWith === 2 || filterObject.mappedWith === 3 || filterObject.mappedWith === 14 || filterObject.mappedWith === 15) && data['VendorId']
                  ? true
                  : false,
          }
        }
      }
    }

    if (data?.LineItems) {
      const generatedNewLineItems = data?.LineItems?.map((items: any, index: number) => {
        let updatedLineItemObj: any = {}
        let updatedLineItemErrorObj: any = {}

        for (const [key, value] of Object.entries(items)) {
          const filterLineItemObject = keyValueLineItemFieldObj.find((d: any) => d.value === key)

          if (!filterLineItemObject) {
            continue
          }

          if (filterLineItemObject) {
            updatedLineItemObj = {
              ...updatedLineItemObj,
              Index: index + 1,
              Id: items?.Id,
              [filterLineItemObject.key]: filterLineItemObject.key === 'releasetopay' && !value ? false : value,
            }
          }

          if (filterLineItemObject && filterLineItemObject.key in generateLinetItemFieldsErrorObj) {
            updatedLineItemErrorObj = {
              ...updatedLineItemErrorObj,
              Index: index + 1,
              [filterLineItemObject.key]: !value ? false : true,
            }
          }
        }

        if (
          !updatedLineItemObj.rate &&
          'amount' in updatedLineItemObj &&
          updatedLineItemObj.amount &&
          'quantity' in updatedLineItemObj &&
          updatedLineItemObj.quantity
        ) {
          updatedLineItemObj.rate = updatedLineItemObj.amount / updatedLineItemObj.quantity
          updatedLineItemErrorObj.rate = true
        }
        if (
          !updatedLineItemObj.amount &&
          'rate' in updatedLineItemObj &&
          updatedLineItemObj.rate &&
          'quantity' in updatedLineItemObj &&
          updatedLineItemObj.quantity
        ) {
          updatedLineItemObj.amount = updatedLineItemObj.rate * updatedLineItemObj.quantity
          updatedLineItemErrorObj.amount = true
        }
        if (
          !updatedLineItemObj.quantity &&
          'amount' in updatedLineItemObj &&
          updatedLineItemObj.amount &&
          'rate' in updatedLineItemObj &&
          updatedLineItemObj.rate
        ) {
          updatedLineItemObj.quantity = roundUp(updatedLineItemObj.amount / updatedLineItemObj.rate)
          updatedLineItemErrorObj.quantity = true
        }
        if (!updatedLineItemObj.quantity && !updatedLineItemObj.rate) {
          updatedLineItemObj.amount = 0
          updatedLineItemErrorObj.amount = false
        }
        if (!updatedLineItemObj.amount && !updatedLineItemObj.rate) {
          updatedLineItemObj.quantity = 0
          updatedLineItemErrorObj.amount = false
        }
        if (!updatedLineItemObj.amount && !updatedLineItemObj.quantity) {
          updatedLineItemObj.rate = 0
          updatedLineItemErrorObj.amount = false
        }

        return { updatedLineItemObj, updatedLineItemErrorObj }
      })

      newLineItems = generatedNewLineItems.map((item: any) => item.updatedLineItemObj);
      newLineItemsErrorObj = generatedNewLineItems.map((item: any) => item.updatedLineItemErrorObj);
    } else {
      newLineItemsErrorObj = [generateLinetItemFieldsErrorObj]
    }
  }

  return {
    newLineItems,
    newLineItemsErrorObj,
    updatedDataObj,
    updatedDataErrorObj,
  }
}

const getViewUpdatedDataFromDetailsResponse = (
  data: any,
  keyValueMainFieldObj: any,
  keyValueLineItemFieldObj: any,
  vendorOptions: any,
  termOptions: any,
  accountOptions: any
) => {
  let updatedDataObj: any = {}
  let newLineItems: any = []

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      const filterObject = keyValueMainFieldObj.find((d: any) => d.value === key)

      if (!filterObject) {
        continue
      }

      const currentDate = new Date()

      const poNumberOptions: any = []

      let dropdownValue = ''
      switch (filterObject?.key) {
        case 'vendor':
          dropdownValue =
            value && vendorOptions && vendorOptions?.length > 0
              ? vendorOptions.find((item: any) => item?.value === Number(value))?.label
              : ''
          break
        case 'term':
          dropdownValue =
            value && termOptions && termOptions?.length > 0
              ? termOptions.find((item: any) => item?.value === Number(value))?.label
              : ''
          break
        case 'pono':
          dropdownValue =
            value && poNumberOptions && poNumberOptions?.length > 0
              ? poNumberOptions?.find((item: any) => item.value === value).label
              : ''
          break
      }

      if (filterObject) {
        updatedDataObj = {
          ...updatedDataObj,
          [filterObject?.key]:
            filterObject?.key === 'date'
              ? data?.BillDate
                ? format(data?.BillDate, 'MM/dd/yyyy')
                : format(currentDate, 'MM/dd/yyyy')
              : filterObject?.key === 'duedate'
                ? data?.DueDate
                  ? format(data?.DueDate, 'MM/dd/yyyy')
                  : format(currentDate, 'MM/dd/yyyy')
                : filterObject?.key === 'glPostingDate'
                  ? data?.GLPostingDate
                    ? format(data?.GLPostingDate, 'MM/dd/yyyy')
                    : format(currentDate, 'MM/dd/yyyy')
                  : dropdownValue
                    ? dropdownValue
                    : value === true
                      ? 'Yes'
                      : value === false
                        ? 'No'
                        : filterObject?.options?.length > 0
                          ? filterObject?.options?.find((item: any) => item?.value == value)?.label
                          : value,
        }
      }
    }

    if (data?.LineItems) {
      newLineItems = data?.LineItems?.map((items: any, index: number) => {
        let updatedLineItemObj: any = {}
        for (const [key, value] of Object.entries(items)) {
          const filterLineItemObject = keyValueLineItemFieldObj.find((d: any) => d.value === key)

          if (!filterLineItemObject) {
            continue
          }

          let dropdownValue = ''
          switch (filterLineItemObject?.key) {
            case 'account':
              dropdownValue =
                value &&
                accountOptions &&
                accountOptions?.length > 0 &&
                accountOptions.find((item: any) => item?.value === Number(value))?.label
              break
          }

          if (filterLineItemObject) {
            updatedLineItemObj = {
              ...updatedLineItemObj,
              Index: index + 1,
              Id: items?.Id,
              [filterLineItemObject.key]: dropdownValue
                ? dropdownValue
                : value === true
                  ? 'Yes'
                  : value === false
                    ? 'No'
                    : filterLineItemObject?.options?.length > 0
                      ? filterLineItemObject?.options?.find((item: any) => item?.value == value)?.label
                      : value,
            }
          }
        }
        return updatedLineItemObj
      })
    }
  }

  return {
    newLineItems,
    updatedDataObj,
  }
}

// Handle line item remove
const lineItemRemoveArr = (data: any, currentIndex: number) => {
  return (
    data &&
    data
      .filter((i: any) => i.Index !== currentIndex)
      .map((item: any, index: number) => {
        return {
          ...item,
          Index: index + 1,
        }
      })
  )
}

// Mapping field name key based on field mapping and get details api response
const returnKeyValueObjForFormFields = (MainFieldConfiguration: any, LineItemConfiguration: any) => {
  let keyValueMainFieldObj: any = []
  let keyValueLineItemFieldObj: any = []
  MainFieldConfiguration?.map((item: any) => {
    switch (item.Name) {
      case 'vendor':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'VendorId',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'date':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'BillDate',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'billnumber':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'BillNumber',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'duedate':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'DueDate',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'pono':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'PoNumber',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'term':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'TermId',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'glPostingDate':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'GLPostingDate',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'attachment':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Attachments',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'placeThisBillOnHold':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'OnHold',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom1':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom1',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom2':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom2',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom3':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom3',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom4':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom4',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom5':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom5',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom6':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom6',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom7':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom7',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom8':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom8',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom9':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom9',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom10':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom10',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom11':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom11',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom12':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom12',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom13':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom13',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom14':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom14',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom15':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom15',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      default:
        return null
    }
  })

  LineItemConfiguration?.map((item: any) => {
    switch (item.Name) {
      case 'account':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'GLAccount',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'amount':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Amount',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'description':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Description',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'rate':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Rate',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'quantity':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Quantity',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom1':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom1',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom2':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom2',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom3':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom3',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom4':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom4',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom5':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom5',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom6':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom6',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom7':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom7',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom8':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom8',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom9':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom9',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom10':
        keyValueLineItemFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom10',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom11':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom11',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom12':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom12',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom13':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom13',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom14':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom14',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      case 'Custom15':
        keyValueMainFieldObj.push({
          key: item.Name,
          label: item.Label,
          value: 'Custom15',
          options: item.Value ? JSON.parse(item.Value) : [],
          mappedWith: item.MappedWith
        })
        return
      default:
        return null
    }
  })

  return {
    keyValueMainFieldObj,
    keyValueLineItemFieldObj,
  }
}

const getTimeDifference = (createdOn: any) => {
  //TATStatus 1 for tat over
  //TATStatus 2 for 25% percent of api hours
  //TATStatus 3 for normal

  const date = new Date(createdOn)
  const offset = date.getTimezoneOffset()
  const createdDate = new Date(date.getTime() - offset * 60 * 1000)

  const apiHoursInSeconds = 24 * 3600
  const currentDate: Date = new Date()
  const secondsDifference = Math.floor((currentDate.getTime() - createdDate.getTime()) / 1000)

  let remainingSec = 86400 - secondsDifference // 86400 sec = 24 hours
  const twofivePercentOfTAT = apiHoursInSeconds * (25 / 100)
  const hours = Math.floor(remainingSec / 3600)
  const minutes = Math.round((remainingSec % 3600) / 60)

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

  if (hours === 23 && minutes === 60) {
    return {
      TATStatus: 3,
      value: '24:00',
    }
  }
  if (remainingSec < apiHoursInSeconds && remainingSec > 0) {
    if (remainingSec <= twofivePercentOfTAT) {
      return {
        TATStatus: 2,
        value: formattedTime,
      }
    } else {
      return {
        TATStatus: 3,
        value: formattedTime,
      }
    }
  } else {
    return {
      TATStatus: 1,
      value: '00:00',
    }
  }
}

interface FormField {
  [key: string]: any
}

interface LineItemField {
  [key: string]: any
}

interface FieldLibraryErrors {
  [key: string]: any
}

interface ErrorObject {
  [key: string]: any
}

// Main form fields create new error values
function getNewErrorValues(errorsValues: ErrorObject, fieldLibraryErrors: FieldLibraryErrors): ErrorObject {
  let newErrorValues: ErrorObject = {}
  for (const [key, value] of Object.entries(errorsValues)) {
    if (fieldLibraryErrors.hasOwnProperty(key)) {
      newErrorValues[key] = value
    }
  }
  return newErrorValues
}

/*======================= Vallidation check on submit form ========================*/
// Function to process line item fields and get error values
function getNewLineItemErrorValues(
  lineItemsFieldsData: LineItemField[],
  disableFields: string[],
  generateLinetItemFieldsErrorObj: FieldLibraryErrors
): ErrorObject[] {
  let newLineItemErrorValues: ErrorObject[] = []

  lineItemsFieldsData.forEach((item) => {
    const errorsLinetItemValues = verifyAllFieldsValues(item)

    if (disableFields.includes('rate')) delete errorsLinetItemValues.rate
    if (disableFields.includes('quantity')) delete errorsLinetItemValues.quantity

    let newLineItemErrorValuesObj: ErrorObject = {}
    for (const [key, value] of Object.entries(errorsLinetItemValues)) {
      if (generateLinetItemFieldsErrorObj.hasOwnProperty(key)) {
        newLineItemErrorValuesObj[key] = key === 'Index' ? item.Index : value
      }
    }
    newLineItemErrorValues.push(newLineItemErrorValuesObj)
  })

  return newLineItemErrorValues
}

// Function to validate line item fields and count errors
function countErrorsInItems(fieldLibraryErrors: FieldLibraryErrors[]): number {
  let errorInItems = 0
  fieldLibraryErrors.forEach((fieldLibraryError) => {
    if (!validate(fieldLibraryError)) {
      errorInItems++
    }
  })
  return errorInItems
}

// Example usage of the above functions
function processFormAndLineItems(
  formFields: FormField,
  lineItemsFieldsData: LineItemField[],
  lineItemDisableFields: string[],
  hasFormFieldLibraryErrors: FieldLibraryErrors,
  hasLineItemFieldLibraryErrors: FieldLibraryErrors[],
  verifyAllFieldsValues: (fields: any) => ErrorObject,
  generateLinetItemFieldsErrorObj: any
) {
  const errorsValues = verifyAllFieldsValues(formFields)
  const newErrorValues = getNewErrorValues(errorsValues, hasFormFieldLibraryErrors)

  const newLineItemErrorValues = getNewLineItemErrorValues(
    lineItemsFieldsData,
    lineItemDisableFields,
    generateLinetItemFieldsErrorObj
  )

  const errorInItems = countErrorsInItems(hasLineItemFieldLibraryErrors)

  return { newErrorValues, newLineItemErrorValues, errorInItems }
}
/*======================== Validation end on submit form ============================ */

// Set loader state based on postSaveAs value
function setLoaderState(postSaveAs: number, loader: any, setLoader: any) {
  let newLoader
  switch (postSaveAs) {
    case 12:
      newLoader = { ...loader, postAsPaid: true }
      break
    case 2:
      newLoader = { ...loader, saveAsDraft: true }
      break
    case 3:
      newLoader = { ...loader, post: true }
      break
    default:
      break
  }
  setLoader(newLoader)
}

// Handle Form Field Errors
function handleFormFieldErrors(
  formFields: any,
  lineItemsFieldsData: any,
  lineItemDisableFields: string[],
  hasFormFieldLibraryErrors: any,
  hasLineItemFieldLibraryErrors: any[],
  generateLinetItemFieldsErrorObj: any,
  setHasLineItemFieldErrors: any,
  setHasFormFieldErrors: any,
  verifyAllFieldsValues: (fields: any) => any,
  validate: (errors: any) => boolean,
  onErrorLoader: any,
  postSaveAs: number
) {
  const { newErrorValues, newLineItemErrorValues, errorInItems } = processFormAndLineItems(
    formFields,
    lineItemsFieldsData,
    lineItemDisableFields,
    hasFormFieldLibraryErrors,
    hasLineItemFieldLibraryErrors,
    verifyAllFieldsValues,
    generateLinetItemFieldsErrorObj
  )

  setHasFormFieldErrors(newErrorValues)
  setHasLineItemFieldErrors(newLineItemErrorValues)

  if (!validate(hasFormFieldLibraryErrors)) {
    onErrorLoader(postSaveAs)
    Toast.error('Please add required fields.')
    return false
  }

  if (errorInItems > 0) {
    onErrorLoader(postSaveAs)
    Toast.error('Please enter required field.')
    return false
  }

  return true
}

// Validate Totals
function validateTotals(
  formFields: any,
  formattedTotalAmountValue: string,
  formattedTotalTaxAmountValue: string,
  onErrorLoader: any,
  postSaveAs: number
) {
  const calculatedTotalAmount =
    formFields.amountsare === '1'
      ? parseFloat(formattedTotalAmountValue) + parseFloat(formattedTotalTaxAmountValue)
      : parseFloat(formattedTotalAmountValue)
  if (parseFloat(formFields.total) !== calculatedTotalAmount) {
    onErrorLoader(postSaveAs)
    Toast.error('The totals does not match.')
    return false
  }
  return true
}

// Validate Attachments
function validateAttachments(formFields: any, onErrorLoader: any, postSaveAs: number) {
  const maxFileCount = 5
  const maxFileSizeMB = 50

  if (formFields?.attachment?.length > maxFileCount) {
    onErrorLoader(postSaveAs)
    Toast.error('You are only allowed to upload a maximum of 5 files at a time')
    return false
  }

  let totalFileSizeMB = 0
  for (const file of formFields?.attachment || []) {
    totalFileSizeMB += file.size / (1024 * 1024)
  }

  if (totalFileSizeMB > maxFileSizeMB) {
    onErrorLoader(postSaveAs)
    Toast.error(`Total file size exceeds the maximum limit of ${maxFileSizeMB} MB`)
    return false
  }

  return true
}

const parseAndFormatDate = (dateString: any) => {
  if (dateString) {
    const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date())
    return format(parsedDate, 'yyyy-MM-dd HH:mm:ss.SSS')
  }
  return null
}

export {
  billStatusEditable,
  convertFractionToRoundValue,
  convertUTCtoLocal,
  getRoundValue,
  getTimeDifference,
  getUpdatedDataFromDetailsResponse,
  getViewUpdatedDataFromDetailsResponse,
  handleFormFieldErrors,
  limitString,
  lineItemRemoveArr,
  parseAndFormatDate,
  processFormAndLineItems,
  returnKeyValueObjForFormFields,
  setLoaderState,
  validateAttachments,
  validateTotals,
}
