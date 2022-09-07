# AWS lambda crud json object

## Test

You can now send an HTTP request directly to the endpoint using a tool like curl

```bash
serverless invoke --function jsonCrud --log --data='{ "data": "{}"}'
```

```bash
serverless invoke local --function jsonCrud --data='{ "data": "{}"}'
```

The expected result should be similar to:

```bash
"Saved"
--------------------------------------------------------------------
START RequestId: c658859d-bd11e6-ac1f-c7a7ee5bd7f3 Version: $LATEST
END RequestId: c658859d-bd11e6-ac1f-c7a7ee5bd7f3
REPORT RequestId: c658859d-bd11e6-ac1f-c7a7ee5bd7f3	Duration: 436.94 ms	Billed Duration: 500 ms 	Memory Size: 1024 MB	Max Memory Used: 29 MB
```

##
