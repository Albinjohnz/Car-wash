Created a car wash management node-js application which contains the following functions
--POST : -Allows users to add a new service to the system. The request requires a service name, description, and price.
         -This endpoint allows users to add a new service by providing the name, description, and price.
         - If any field is missing, it returns a 400 status with a message indicating the missing fields.
         - On successful insertion, it returns a 200 status with the message Service added successfully.
---GET : Retrieves all services available in the system.
        - This endpoint retrieves all the services in the system.
        - Returns a 200 status and the list of all services in JSON format.
--PUT : Updates the details of an existing service, such as name, description, and price.
       - This endpoint allows users to update the details (name, description, and price) of an existing service identified by its id.
       - If the update is successful, it returns a 200 status with a message confirming the update.
---DELETE  – Delete a Service
           - This endpoint allows users to delete a service by its id.
           - After deleting a service, it reorganizes the service IDs to maintain a continuous sequence.
            - The AUTO_INCREMENT of the service table is also reset to prevent any gaps in IDs.

---Most of the styles were created using AI to make it more professional
---Created as sql to insert , fetch and delte data from its table(services)

Issues Faced
-- faced an issue while deleting a service. when ever a service is deleted the ids of the remaining services doenot change ie: remains the same. with the help of AI completed it.

Unit Testing
tested for post and get functions.
created testcases for post and working.
Test Case:Database failure (simulating a database error)
Mock the database query to simulate a failure

-- Also did Integration testing 