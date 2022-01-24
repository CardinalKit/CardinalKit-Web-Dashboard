import request from "@/Rest";


export const AddUserData = async (
    { commit },
    { studyId, userId, payload }
  ) => {
    let user = await request
      .GET(`/studies/${studyId}/users/${userId}/`)
      .Execute();
    await request
        .PUT(
            `/studies/${studyId}/users/${userId}/`, 
            {
                data: payload
            }
        )
        .Execute();
  };
  
  