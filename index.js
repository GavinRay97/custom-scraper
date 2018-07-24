var fs = require('fs');
var axios = require("axios")

const fileString = process.argv.slice(2).shift()
const emailRegex = /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
const emailFilters = [
  "sm.x",
  "md.x",
  "lg.x",
  "png",
  "gif",
  "jpg",
  "jpeg",
  "godaddy",
  "example"
]

async function main() {
  if (fileString) {
    try {
      const domainArray = fs.readFileSync(fileString).toString().split("\n");
      const domainContacts = {}
      
      for (let domain of domainArray) {
        try {
          const res = await axios.get(`https://${domain}`, {responseType: "document"})
          if (res) {
            const possibleEmails = Array.from(new Set(res.data.match(emailRegex)))
            const filteredEmails = possibleEmails.filter(email => emailFilters.every(filter => {
                return email.indexOf(filter) == -1
              }
            ))
          
            if (filteredEmails.length) {
              Object.assign(domainContacts, {[domain]: filteredEmails})
            }
          }
        }
        catch (err) {
          // console.log(err)
        }
      }

      fs.writeFileSync("results.json", JSON.stringify(domainContacts, null, 2))
      console.log("DONE")
      
    } catch (err) {
      // console.log(err)
  
    }
  
  }
}

main()