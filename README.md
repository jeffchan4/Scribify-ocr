
# Scribify

Scribify is a deployed web application using AWS Amplify and AWS EC2 that helps medical providers streamline documentation of medical records from images. The application uses Google OCR(optical character recognition) API to extract text from provided images and used MeaningCloudAI API to automate comprehensive patient histories. User and patient data was stored in AWS MySQL. Some challenges faced were familiarizing with new technologies that were used and understanding documentations of their APIs. Another challenge adjusting to working in a sandbox environment as my current machine was not able to run React's newest versions.
Some implementations in the future could be getting more patient data such as height, weight, bloodtype, medical histories, and using them to generate a holistic view of the patients health and generate a health plan based on the patient's data.


## Requirements

React 18.2.0, Express 4.18.2, Bootstrap 5.3.2 was used in creating this application. 

## How to use

The user will be prompted to a user Login screen and account creation if they're a new user.



<img width="350" alt="Screen Shot 2024-01-04 at 3 11 02 PM" src="https://github.com/jeffchan4/Scribify-ocr/assets/112337204/e28497f1-d9e4-4cd4-929c-542606175533">






### Patient List
The provider will see their list of patients and can insert an image of a medical document to extract its text.


<img width="350" alt="Screen Shot 2024-01-04 at 3 27 43 PM" src="https://github.com/jeffchan4/Scribify-ocr/assets/112337204/9244251b-1ee4-4f41-bb37-609c3e20e39a">


### Insert Document into OCR

<img width="350" alt="Scribify" src="https://github.com/jeffchan4/Scribify-ocr/assets/112337204/771e5f68-b052-43fe-90f6-6a22141f1179">







