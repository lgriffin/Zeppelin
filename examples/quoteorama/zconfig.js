exports.config = 
{
  live: {enabled: "true", environment: "development", i18n: "en"},

  environments: {test: {database: {name:"quoteorama-test"}},
                 development: {database: {name:"quoteorama-development"}},
                 production: {database: {name:"quoteorama-production"}}},

  facebook: { appId: "146308242084763",
              appSecret: "1fd2c8179954f52b75de54a064c87185"},

  webdav: true,

  i18n: ["en-gb"]
}

