app.controller('UserCtrl', ['$scope', '$log', function($scope, $log) {
  $scope.users =
  [
    {
      "userId": 0,
      "firstName": "Ann",
      "lastName": "Brown",
      "email": "ab@gmail.com",
    }
  ]
  $scope.userSessions =
  [
    {
      datetime: "2017-03-05T14:24:17.725Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg1NzY5OH5WR0c4UEMwTTJ2SlQ5akNDbENWMUhXS1h-UH4",
      name: "okapi453",
      _id: "58bc1f91eaad2d00119618f8",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9ZGYxNmJmZGI4ZDBlZmIzZDNkY2IwNjIyZDljOTRmNzIzMjNmMzVhNDpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnMU56WTVPSDVXUjBjNFVFTXdUVEoyU2xRNWFrTkRiRU5XTVVoWFMxaC1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg1OCZub25jZT0wLjM3OTk5Njg0NDQzMTYwNDQmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ4ODgxMDI1OA=="
    },
    {
      datetime: "2017-03-05T14:29:44.805Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg4NDc5Mn5XZ2UzUjd4Uk9oSUxaeThQdVNLVUhWblN-UH4",
      name: "dinosaur392",
      _id: "58bc1faceaad2d00119618f9",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9NGE0MDczY2E4MWIzY2EyODk4ZDIyYWM3ZTZlOTBjOGE3ZDc1NzQ3ZTpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnNE5EYzVNbjVYWjJVelVqZDRVazlvU1V4YWVUaFFkVk5MVlVoV2JsTi1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg4NSZub25jZT0wLjc3NjQwNDA5OTkwNDE0OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg4ODEwMjg1"
    },
    {
      datetime: "2017-02-02T10:24:18.805Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg4NDc5Mn5XZ2UzUjd4Uk9oSUxaeThQdVNLVUhWblN-UH4",
      name: "turtle406",
      _id: "58bc1faceaad2d00119618f9",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9NGE0MDczY2E4MWIzY2EyODk4ZDIyYWM3ZTZlOTBjOGE3ZDc1NzQ3ZTpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnNE5EYzVNbjVYWjJVelVqZDRVazlvU1V4YWVUaFFkVk5MVlVoV2JsTi1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg4NSZub25jZT0wLjc3NjQwNDA5OTkwNDE0OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg4ODEwMjg1"
    },
    {
      datetime: "2017-06-25T18:24:03.805Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg4NDc5Mn5XZ2UzUjd4Uk9oSUxaeThQdVNLVUhWblN-UH4",
      name: "crocodile142",
      _id: "58bc1faceaad2d00119618f9",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9NGE0MDczY2E4MWIzY2EyODk4ZDIyYWM3ZTZlOTBjOGE3ZDc1NzQ3ZTpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnNE5EYzVNbjVYWjJVelVqZDRVazlvU1V4YWVUaFFkVk5MVlVoV2JsTi1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg4NSZub25jZT0wLjc3NjQwNDA5OTkwNDE0OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg4ODEwMjg1"
    },
    {
      datetime: "2017-02-20T12:25:22.805Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg4NDc5Mn5XZ2UzUjd4Uk9oSUxaeThQdVNLVUhWblN-UH4",
      name: "weasel821",
      _id: "58bc1faceaad2d00119618f9",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9NGE0MDczY2E4MWIzY2EyODk4ZDIyYWM3ZTZlOTBjOGE3ZDc1NzQ3ZTpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnNE5EYzVNbjVYWjJVelVqZDRVazlvU1V4YWVUaFFkVk5MVlVoV2JsTi1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg4NSZub25jZT0wLjc3NjQwNDA5OTkwNDE0OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg4ODEwMjg1"
    }
  ]
}])
