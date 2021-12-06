import React, {FC} from "react";
import {TwitterPicker} from "react-color";
import {useEditor} from "./hook";

type EditorProps = {}

const Editor: FC<EditorProps> = () => {
    const {
        state,
        container,
        handleAddText,
        handleDownload,
        handleAddBackground,
        handleRemoveBackground,
        handleChangeColor,
        handleChangeStyleText,
        handleChangeFontSize,
        handleUploadImage,
        handleOnChangeBackgroundColor,
        handleUploadImageWithLink,
        handleOnChangeLink,
    } = useEditor();
    return <>
        <div>
            <div className="settingns-wrapper">
                <div className="setting-item">
                    <button onClick={() => handleAddText()}>Добавить текст</button>
                </div>
                <div className="setting-item"><label>
                    <input
                        type="color"
                        value={state.color}
                        onChange={handleChangeColor}
                    />
                    цвет текста
                </label></div>
                <div className="setting-item">
                    <label>
                        <input
                            type="checkbox"
                            name="fonttype"
                            onChange={(e) => {
                                handleChangeStyleText(e, 'fontWeight')
                            }}
                        />
                        Bold
                    </label>
                </div>
                <div className="setting-item">
                    <label>
                        <input
                            type="checkbox"
                            name="fonttype"
                            onChange={(e) => {
                                handleChangeStyleText(e, 'fontStyle')
                            }}
                        />
                        Курсив
                    </label>
                </div>
                <div className="setting-item">
                    <label>
                        <input
                            type="checkbox"
                            name="fonttype"
                            onChange={(e) => {
                                handleChangeStyleText(e, 'underline')
                            }}
                        />
                        Подчеркнутый
                    </label>
                </div>
                <div className="setting-item">
                    <label>
                        <input
                            type="range"
                            min="1"
                            max="120"
                            step="1"
                            value={state.fontSize}
                            onChange={handleChangeFontSize}
                        />
                        Размер шрифта
                    </label>
                </div>
            </div>
            <div className="settingns-wrapper">
                <div className="setting-item">
                    <button
                        onClick={() => handleAddBackground("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg")}>Добавить
                        Фон
                    </button>
                </div>
                <div className="setting-item">
                    <button onClick={handleRemoveBackground}>Удалить Фон</button>
                </div>
                <div className="setting-item">
                    <label htmlFor="img">Upload image
                        <input
                            type="file"
                            id="img"
                            name="img"
                            accept="image/*"
                            onChange={handleUploadImage}
                        />
                    </label>
                </div>
                <div className="setting-item">
                    <input
                        value={state.linkImage}
                        type="text"
                        onChange={handleOnChangeLink}
                    />
                    <button onClick={handleUploadImageWithLink}>загрузить по ссылке</button>
                </div>
            </div>


            <a
                className="download"
                download={"image.png"}
                href={state.href}
                onClick={handleDownload}
            >
                Скачать картинку
            </a>

            <TwitterPicker
                color={state.backgroundColor}
                onChange={handleOnChangeBackgroundColor}
            />
            <canvas
                id="canvas"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "2px solid black",
                    margin: "auto"
                }}
                ref={container}
            ></canvas>
        </div>
    </>
}

export default Editor;