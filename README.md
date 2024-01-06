
# Scribify

Scribify is a deployed web application using AWS Amplify and AWS EC2 that helps medical providers streamline documentation of medical records from images. The application uses Google OCR(optical character recognition) API to extract text from provided images and used MeaningCloudAI API to automate comprehensive patient histories. User and patient data was stored in AWS MySQL. Some challenges faced were familiarizing with new technologies that were used and understanding documentations of their APIs. Another challenge adjusting to working in a sandbox environment as my current machine was not able to run React's newest versions.
Some implementations in the future could be getting more patient data such as height, weight, bloodtype, medical histories, and using them to generate a holistic view of the patients health and generate a health plan based on the patient's data.


## Requirements

React 18.2.0, Express 4.18.2, Bootstrap 5.3.2 was used in creating this application. 

## How to use

The user will be prompted to a user Login screen and account creation if they're a new user.

<img width="200" alt="Screen Shot 2024-01-04 at 3 11 02 PM" src="https://github.com/jeffchan4/Scribify-Deployed/assets/112337204/47f906b3-a5e2-4375-8753-c86fcbff0743">


The provider will see their list of patients and can insert an image of a medical document to extract its text.

### Patient List
<img width="300" alt="Screen Shot 2024-01-04 at 3 27 43 PM" src="https://github.com/jeffchan4/Scribify-Deployed/assets/112337204/b382c8d7-85b9-449f-bc16-4aa50211ea52">

### Insert Document into OCR
<img width="300" alt="Screen Shot 2024-01-04 at 3 20 39 PM" src="https://github.com/jeffchan4/Scribify-Deployed/assets/112337204/cdb6fd80-9764-4652-b587-76319bf70e67">






