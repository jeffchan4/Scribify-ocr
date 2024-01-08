
# Scribify

Scribify is a deployed web application using AWS Amplify and AWS EC2 that helps medical providers streamline documentation of medical records from images. The application uses Google OCR(optical character recognition) API to extract text from provided images and used MeaningCloudAI API to automate comprehensive patient histories. User and patient data was stored in AWS MySQL. Some challenges faced were familiarizing with new technologies that were used and understanding documentations of their APIs. Another challenge adjusting to working in a sandbox environment as my current machine was not able to run React's newest versions.
Some implementations in the future could be getting more patient data such as height, weight, bloodtype, medical histories, and using them to generate a holistic view of the patients health and generate a health plan based on the patient's data.


## Requirements

React 18.2.0, Express 4.18.2, Bootstrap 5.3.2 was used in creating this application. 

## How to use

### Login
The provider will be prompted to a user login screen and account creation if they're a new user. 




https://github.com/jeffchan4/Scribify-ocr/assets/112337204/9ecd1886-73ad-4ec7-929f-d585d1fd00fb





### Patient List
The provider will see their list of patients and can insert new patients.



https://github.com/jeffchan4/Scribify-ocr/assets/112337204/fb1d6312-2bb2-4533-815b-06fc1ecc4cb2




### Insert Document for OCR
An image of a medical document can be uploaded for text extraction and will be saved within the patient's records.



https://github.com/jeffchan4/Scribify-ocr/assets/112337204/5f388382-b1e8-4d75-8b8a-3d63be8bcb53

### Generate Patient History
By clicking the Summarize Button, a comprehensive Patient History will be generated from the extracted text in the patient's record. The user can logoff once done with their session.



https://github.com/jeffchan4/Scribify-ocr/assets/112337204/6d88fa26-61f2-41ab-8e57-6020cea6e7dd








