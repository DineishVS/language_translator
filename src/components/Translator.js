import React, { useState } from 'react';
import axios from 'axios';

const Translator = () => {
    const [inputText, setInputText] = useState('');
    const [targetLang, setTargetLang] = useState('es');
    const [translatedText, setTranslatedText] = useState('');
    const [recognizedText, setRecognizedText] = useState('');
    const [audioBase64, setAudioBase64] = useState('');

    const translateText = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/translate/text/', {
                text: inputText,
                target_lang: targetLang
            });
            setTranslatedText(response.data.translated_text);
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    const startSpeechRecognition = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setRecognizedText(transcript);
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
        recognition.start();
    };

    const playTranslatedText = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/translate/audio/', {
                file: recognizedText,  // Ensure this is what your backend expects
                target_lang: targetLang
            });
            setAudioBase64(response.data.audio);
        } catch (error) {
            console.error('Error playing translated text:', error);
        }
    };

    return (
        <div id="app">
            <div>
                <textarea
                    id="inputText"
                    placeholder="Enter text to translate"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                ></textarea>
                <select
                    id="targetLang"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                >
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="zh-cn">Chinese (Simplified)</option>
                    <option value="zh-tw">Chinese (Traditional)</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="ru">Russian</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="tr">Turkish</option>
                    <option value="vi">Vietnamese</option>
                    <option value="pl">Polish</option>
                    <option value="nl">Dutch</option>
                    <option value="sv">Swedish</option>
                    <option value="da">Danish</option>
                    <option value="no">Norwegian</option>
                    <option value="fi">Finnish</option>
                    <option value="he">Hebrew</option>
                </select>
                <button className="primary-button" onClick={translateText}>Translate Text</button>
                <div id="translatedText">{translatedText}</div>
            </div>
            <div>
                <button className="secondary-button" onClick={startSpeechRecognition}>Start Speech Recognition</button>
                <div id="recognizedText">{recognizedText}</div>
            </div>
            <div>
                <button className="tertiary-button" onClick={playTranslatedText}>Play Translated Text</button>
                {audioBase64 && 
                    <audio controls>
                        <source src={`data:audio/mp3;base64,${audioBase64}`} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                }
            </div>
        </div>
    );
};

export default Translator;
