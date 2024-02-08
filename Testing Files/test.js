const {data} = require('./data')
let combinedObject = {
  "PatientInformation": {
      "patientName": "",
      "patientid": "",
      "patientGender": "",
      "patientAddress": "",
      "patientContact": ""
  },
  "Prescription": {
      "prescriptionNumber": "",
      "prescriptionDate": "",
      "medications": [
          {
              "name": "",
              "dosage": "",
              "quantity": ""
          }
      ]
  },
  "MedicalReport": {
      "reportSummary": "",
      "hospital": "",
      "date": "",
      "recordNumber": "",
      "physician": "",
      "tests": [],
      
  },
  "HospitalBill": {
      "hospital": "",
      "doctorName": "",
      "date": "",
      "medications": [
          {
              "name": "",
              "dose": "",
              "duration": ""
          }
      ]
  },
  "Insurance": {
      "policy": {
          "number": "",
          "startDate": "",
          "endDate": "",
          "coverageType": "",
          "coverageDetails": {
              "inpatient": "",
              "outpatient": "",
              "prescriptionCoverage": ""
          },
          "deductible": "",
          "insuranceProvider": {
              "name": "",
              "contact": "",
              "address": ""
          },
          "services": [
              {
                  "service": "",
                  "description": "",
                  "date": "",
                  "cptCode": "",
                  "charge": ""
              }
          ],
          "charges": {
              "total": "",
              "insurancePayments": "",
              "patientPayments": "",
              "adjustments": ""
          },
          "provider": {
              "name": "",
              "address": "",
              "contact": "",
              "npi": ""
          }
      }
  },
  "PharmacyBill": {
      "pharmacy": {
          "name": "",
          "id": "",
          "address": "",
          "contact": ""
      },
      "totalAmount": "",
      "insuranceCoverage": {
          "coveredAmount": "",
          "patientResponsibility": ""
      },
      "payment": {
          "method": "",
          "transactionId": "",
          "amount": "",
          "date": ""
      }
  }
};

function mergeObjects(obj1, obj2) {
  for (let key in obj2) {
    if (typeof obj2[key] === 'object' && obj2[key] !== null) {
      if (Array.isArray(obj2[key])) {
        if (!obj1[key]) {
          obj1[key] = [];
        }
        obj1[key] = obj1[key].concat(obj2[key]);
      } else {
        if (!obj1[key]) {
          obj1[key] = {};
        }
        obj1[key] = mergeObjects(obj1[key], obj2[key]);
      }
    } else if (obj2[key] !== undefined && obj2[key] !== '' && obj2[key] !== 'Not Provided') {
      if (typeof obj1[key] === 'string') {
        if (!obj1[key].includes(obj2[key])) {
          obj1[key] = obj1[key] ? obj1[key] + ',' + obj2[key] : obj2[key];
        }
      } else {
        obj1[key] = obj2[key];
      }
    }
  }
  return obj1;
}



data.forEach(entry => {
  for (let key in combinedObject) {
      if (entry[key]) {
          combinedObject[key] = mergeObjects(combinedObject[key], entry[key]);
      }
  }
});

console.log(combinedObject);