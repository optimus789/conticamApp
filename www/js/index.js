var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        //this.receivedEvent('deviceready');

        let options = {
            x: 0,
            y: 0,
            width: window.screen.width,
            height: window.screen.height,
            camera: CameraPreview.CAMERA_DIRECTION.BACK,
            toBack: true,
            tapPhoto: true,
            tapFocus: false,
            previewDrag: false
        };
        CameraPreview.startCamera(options);


        $('#my-img').click(function () {


        });

        var self = this;
        setTimeout(function () {
            self.capturePhoto();
        }, 10000);


    },

    capturePhoto: function () {
        var self = this;
        var optionsTake = {
            width: 640,
            height: 640,
            quality: 90
        };
        CameraPreview.takePicture(optionsTake, function (base64PictureData) {
            /*
           base64PictureData is base64 encoded jpeg image. Use this data to store to a file or upload.
           Its up to the you to figure out the best way to save it to disk or whatever for your application.
            */
            // One simple example is if you are going to use it inside an HTML img src attribute then you would do the following:
            imageSrcData = 'data:image/jpeg;base64,' + base64PictureData;

            $("#deviceready").removeClass("blink");

            $('#my-img').attr('src', imageSrcData);
            var url = "192.168.0.103:8000/predict";
            var image = $('#image-id').attr('src');
            //var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
            var blob = base64ToBlob(base64PictureData, 'image/png');
            var formData = new FormData();
            formData.append('picture', blob);

            $.ajax({
                url: url,
                type: "POST",
                cache: false,
                contentType: false,
                processData: false,
                data: formData
            })
                .done(function (e) {
                    alert('done!');
                });

        });


    },



    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }


};

function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
}



app.initialize();