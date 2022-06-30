import request from "@/Rest";


export const AddPatientData = async (
    { commit },
    { studyId, userId, payload }
  ) => {
    await request
        .PUT(
            `/studies/${studyId}/users/${userId}/`, 
            {
                data: payload
            }
        )
        .Execute();
  };
  
export const GetPatient = async (
    { commit },
    { studyId, userId }
    ) => {
    let user = await request
        .GET(`/studies/${studyId}/users/${userId}/`)
        .Execute();
    return user
    };
  
  