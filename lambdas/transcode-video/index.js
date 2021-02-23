'use strict';
var AWS = require('aws-sdk');

var elasticTranscoder = new AWS.ElasticTranscoder({
    region: 'us-east-1',
});

exports.handler = function (event, context, callback) {
    console.log('Welcome');

    var key = event.Records[0].s3.object.key;
    console.log('Key - ', key);

    //the input file may have spaces so replace them with '+'
    var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));
    console.log('SourceKey - ', sourceKey);

    //remove the extension
    var outputKey = sourceKey.split('.')[0];
    console.log('OutputKey - ', outputKey);

    var params = {
        PipelineId: '1613075297406-jgduz9',
        Input: {
            Key: sourceKey,
        },
        Outputs: [
            {
                Key: outputKey + '-1080p' + '.mp4',
                PresetId: '1351620000001-000001', //Generic 1080p
            },
        ],
    };

    elasticTranscoder.createJob(params, function (error, data) {
        if (error) {
            callback(error);
        }
        console.log('Transcoding Successful! ', data);
    });
};
