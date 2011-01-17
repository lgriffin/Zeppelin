exports.config = 
{
  live: {enabled: "true", environment: "development"},
  environments: {test: {database: "canonical-test"},
                 development: {database: "canonical-development"},
                 production: {database: "canonical-production"}},
  webdav: true,
}

