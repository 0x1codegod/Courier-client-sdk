const endpoint = "https://relay-68ezseoyf-0x1codegods-projects.vercel.app/api/relayMetaTx"; 
const fetchit = async ( ) => {
    const res = await fetch(endpoint,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer prj_udYobyOYgCjlFJZXlJHRYuSGHefW"
        },
});
    console.log( await res.json());

}

fetchit();