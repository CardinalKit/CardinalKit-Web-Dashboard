rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      match /studies/{studyId}/users/{userId}{
      function accessToStudy() {
      	let data = get(/databases/$(database)/documents/users_roles/$(request.auth.uid)).data;
      	return "studies" in data && studyId in data.studies;
    	}
      function accessToUser(){
      	let data = get(/databases/$(database)/documents/users_roles/$(request.auth.uid)).data;
      	return "users_access" in data && userId in data.users_access
      }
      	allow read: if request.auth!= null && 
        (
        	request.auth.uid == userId ||
          (
            exists(/databases/$(database)/documents/users_roles/$(request.auth.uid)) &&
            (
              get(/databases/$(database)/documents/users_roles/$(request.auth.uid)).data.rol == "superAdmin" ||
              (
                get(/databases/$(database)/documents/users_roles/$(request.auth.uid)).data.rol == "doctor" &&
                (
                  accessToStudy() ||
                  accessToUser()
                )
              )
            )
          )
        )
        	// 
      }
      match /users_roles/{userId}{
      	allow read: if request.auth.uid == userId
      }
      match /studies/{studyId}/surveys/{surveyId}{
      	allow read: if request.auth != null
      }
    }
  }
}