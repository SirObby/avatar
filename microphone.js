// make a class called microphone

class Microphone {
    constructor() {
        const stream = navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        }).then(stream => {
            const audioContext = new AudioContext();
            const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
            const analyserNode = audioContext.createAnalyser();
            mediaStreamAudioSourceNode.connect(analyserNode);

            const pcmData = new Float32Array(analyserNode.fftSize);
            const onFrame = () => {
                analyserNode.getFloatTimeDomainData(pcmData);
                let sumSquares = 0.0;
                for (const amplitude of pcmData) {
                    sumSquares += amplitude * amplitude;
                }
                //volumeMeterEl.value = Math.sqrt(sumSquares / pcmData.length);
                window.requestAnimationFrame(onFrame);
                this.volume = sumSquares / pcmData.length;
                //console.log(sumSquares / pcmData.length)
            };
            window.requestAnimationFrame(onFrame);
        })
    }
    volume() {
        return this.volume;
    }
}