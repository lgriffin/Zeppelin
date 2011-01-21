exports.config = 
{
  live: {enabled: "true", environment: "development"},
  environments: {test: {database: {name:"canonical-test"}},
                 development: {database: {name:"canonical-development"}},
                 production: {database: {name:"canonical-production"}}},
  webdav: true,
}

