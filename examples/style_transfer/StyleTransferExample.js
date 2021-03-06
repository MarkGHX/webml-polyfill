class StyleTransferExample extends BaseCameraExample {
  constructor(models) {
    super(models);
    this.maxWidth = 380;
    this.maxHeight = 380;
    this.stModels = [{
        modelId: 'starry-night',
        tfliteModel: './model/starry-night.tflite',
        onnxModel: './model/starry-night.onnx'
      }, {
        modelId: 'self-portrait',
        tfliteModel: './model/self-portrait.tflite',
        onnxModel: './model/self-portrait.onnx'
      }, {
        modelId: 'bedroom',
        tfliteModel: './model/bedroom.tflite',
        onnxModel: './model/bedroom.onnx'
        
      }, {
        modelId: 'sunflowers-bew',
        tfliteModel: './model/sunflowers-bew.tflite',
        onnxModel: './model/sunflowers-bew.onnx'
      }, {
        modelId: 'red-vineyards',
        tfliteModel: './model/red-vineyards.tflite',
        onnxModel: './model/red-vineyards.onnx'
      }, {
        modelId: 'sien_with_a_cigar',
        tfliteModel: './model/sien_with_a_cigar.tflite',
        onnxModel: './model/sien_with_a_cigar.onnx'
      }, {
        modelId: 'soup-distribution',
        tfliteModel: './model/soup-distribution.tflite',
        onnxModel: './model/soup-distribution.onnx'
      }, {
        modelId: 'wheatfield_with_crows',
        tfliteModel: './model/wheatfield_with_crows.tflite',
        onnxModel: './model/wheatfield_with_crows.onnx'
      }, {
        modelId: 'la-campesinos',
        tfliteModel: './model/la-campesinos.tflite',
        onnxModel: './model/la-campesinos.onnx'
      }];
  }

  /** @override */
  _predict = async () => {
    const input = {
      src: this._currentInputElement,
      options: {
        inputSize: this._currentModelInfo.inputSize,
        preOptions: this._currentModelInfo.preOptions,
        imageChannels: 4
      },
    };
    await this._runner.run(input);
    this._postProcess();
  };

  _processExtra = (output) => {
    const drawInput = (srcElement, canvasId) => {
      const inputCanvas = document.getElementById(canvasId);
      const resizeRatio = Math.max(Math.max(srcElement.width / this.maxWidth, srcElement.height / this.maxHeight), 1);
      const scaledWidth = Math.floor(srcElement.width / resizeRatio);
      const scaledHeight = Math.floor(srcElement.height / resizeRatio);
      inputCanvas.height = scaledHeight;
      inputCanvas.width = scaledWidth;
      const ctx = inputCanvas.getContext('2d');
      ctx.drawImage(srcElement, 0, 0, scaledWidth, scaledHeight);
    };

    const drawOutput = (outputTensor, inCanvasId, outCanvasId) => {
      const height = this._currentModelInfo.outputSize[0];
      const width = this._currentModelInfo.outputSize[1];
      const mean = [1, 1, 1, 1];
      const offset = [0, 0, 0, 0];
      const bytes = new Uint8ClampedArray(width * height * 4);
      const a = 255;

      for (let i = 0; i < height * width; ++i) {
        let j = i * 4;
        let r = outputTensor[i * 3] * mean[0] + offset[0];
        let g = outputTensor[i * 3 + 1] * mean[1] + offset[1];
        let b = outputTensor[i * 3 + 2] * mean[2] + offset[2];
        bytes[j + 0] = Math.round(r);
        bytes[j + 1] = Math.round(g);
        bytes[j + 2] = Math.round(b);
        bytes[j + 3] = Math.round(a);
      }
      const imageData = new ImageData(bytes, width, height);
      const outCanvas = document.createElement('canvas');
      let outCtx = outCanvas.getContext('2d');
      outCanvas.width = width;
      outCanvas.height = height;
      outCtx.putImageData(imageData, 0, 0, 0, 0, outCanvas.width, outCanvas.height);
      
      const inputCanvas = document.getElementById(inCanvasId);
      const outputCanvas = document.getElementById(outCanvasId);
      outputCanvas.width = inputCanvas.width;
      outputCanvas.height = inputCanvas.height;
      const ctx = outputCanvas.getContext('2d');
      ctx.drawImage(outCanvas, 0, 0, outputCanvas.width, outputCanvas.height);
    };

    if(this._currentInputType == 'image') {
      drawInput(this._currentInputElement, 'inputCanvas');
      drawOutput(output.tensor,'inputCanvas', 'outputCanvas');
    } else {
      drawInput(this._currentInputElement, 'camInCanvas');
      drawOutput(output.tensor,'camInCanvas', 'camOutCanvas');
    }
  };

  _customUI = () => {
    $("#gallery .gallery-image").click((e) => {
      const modelId = $(e.target).attr('id');
      const model = getModelById(this.stModels, modelId);
      if (model != null) {
        if (this._currentModelInfo.format == 'TFLite' && model.tfliteModel != null)
          this._currentModelInfo.modelFile = model.tfliteModel;
        else if (this._currentModelInfo.format == 'ONNX' && model.onnxModel != null)
          this._currentModelInfo.modelFile = model.onnxModel;
      } else {
        throw new Error('Unrecorgnized model, please check your model list.');
      }
      let stname = $('#' + modelId).attr('title');
      let text = `<div class="vg">
      <div>the painting style of <span>Van Gogh<span></div><br>
      <strong>${stname}</strong>
      </div>`;
      $('#stname').html(text);
      $("#gallery .gallery-item").removeClass('hl');
      $(e.target).parent().addClass('hl');
      this.main();
    });
  };
}

$(document).ready(() => {
  $("#gallery .gallery-image").hover(function(e){
    const modelId = $(e.target).attr('id');
    let stname = $('#' + modelId).attr('title');
    let text = `<div class="vg">
    <div>the painting style of <span>Van Gogh<span></div><br>
    <strong>${stname}</strong>
    </div>`;
    $('#stname').html(text);
  });
})

