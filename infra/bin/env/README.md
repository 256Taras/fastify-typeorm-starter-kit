# Description

Script load env variables from .env file and validate it according to .env.example
.env -- private file, shouldn't be exposed publicly
.env.example -- public file

# Note

Script should have \*.cjs (CommonJS) format, because dotenv dependency uses CommonJS (based on 'require').
We cannot mix require and import in single files
