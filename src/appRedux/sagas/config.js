export const customerMasterUrldomain = "https://cors-anywhere.herokuapp.com/https://oaa4qq34j6.execute-api.us-east-2.amazonaws.com/dev";
export const headerParams = {
    "Authorization": localStorage.getItem("accessToken")
  };
  
export const ajaxGetRequest = async (url) =>
  await  axios.get(url)
    .then(data => data)
    .catch(error => error);

export const ajaxPostRequest = async (url,data) =>
    await  axios.post(url,data,{headers:headerParams})
      .then(data => data.data)
      .catch(error => error);
  