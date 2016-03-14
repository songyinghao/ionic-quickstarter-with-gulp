angular.module("starter.configs", [])

.constant("BaseConfiguration", {
	"url": "https://www.example.com",
	"debug": false
})

.constant("APP", {
	"devMode": true
})

.constant("ServerConfiguration", {
	"baseApiUrl": "http://localhost:3000/api/v1/",
	"domain": "http://localhost:3000"
})

;