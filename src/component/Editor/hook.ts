import {ChangeEvent, RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import { fabric } from "fabric";
import {Canvas } from "fabric/fabric-impl";
import {ColorResult} from "react-color";

type TData = {
    canvas: Canvas | null;
    backgroundColor: string;
    fontSize: string;
    href: string;
    color: string;
    canvasScale: number;
    backgroundImage: string;
    linkImage:string;
}
type TKeyStyle = 'fontWeight'|'fontStyle'|'underline';

export type TFUEditor = ()=>{
    state:TData;
    container:RefObject<HTMLCanvasElement>;
    handleAddText:(value?:string)=>void;
    handleDownload:()=>void;
    handleAddBackground:(url:string)=>void;
    handleRemoveBackground:()=>void;
    handleChangeColor:(event:ChangeEvent<HTMLInputElement>)=>void;
    handleChangeStyleText:(event:ChangeEvent<HTMLInputElement>,keyStyle:TKeyStyle)=>void;
    handleChangeFontSize:(event:ChangeEvent<HTMLInputElement>)=>void;
    handleUploadImage:(event:ChangeEvent<HTMLInputElement>)=>void;
    handleOnChangeBackgroundColor:(color:ColorResult)=>void;
    handleUploadImageWithLink:()=>void;
    handleOnChangeLink:(event:ChangeEvent<HTMLInputElement>)=>void;
    isModal:boolean;
    setIsModal:(v:boolean)=>void;
}
export const useEditor:TFUEditor = ()=>{
    const [data, setData] = useState<TData>({
        canvas: null,
        backgroundColor: "#ffffff",
        fontSize: '24',
        href: "",
        color: "#000000",
        canvasScale: 1,
        backgroundImage: "",
        linkImage:'',
    });

    const [isModal, setIsModal] = useState(false);

    const container = useRef<HTMLCanvasElement>(null);

    const handleOnChangeLink:ReturnType<TFUEditor>['handleOnChangeLink'] = (event)=>{
        setData((prev)=>({...prev, linkImage:event.target.value}))
    }

    /** функция добавляет текст на canvas */
    const handleAddText:ReturnType<TFUEditor>['handleAddText'] = (value)=>{
        const {canvas, color} = data;
        if(canvas){
            canvas.add(
                new fabric.IText(`${value || 'Текст'}`, {
                    fontFamily: "arial",
                    fill: color,
                    fontSize: 29,
                    padding: 5,
                    left: 0,
                })
            )
        }
        setData((prev)=>({...prev, canvas}));
    }

    /** функция изменяет цвет выбранного текста */
    const handleChangeColor:ReturnType<TFUEditor>['handleChangeColor'] = (event) => {
        const { canvas } = data;
        if (canvas && canvas.getActiveObject()) {
            canvas.getActiveObject().set("fill", event.target.value);
            canvas.renderAll();
        }
        setData((prev)=>({...prev, canvas, color:event.target.value}));
    };

    /** функция изменяет стили текста по ключам */
    const handleChangeStyleText:ReturnType<TFUEditor>['handleChangeStyleText'] = (event, keyStyle)=>{
        const { canvas } = data;
        let value:string | boolean  = '';
        if(keyStyle === 'underline'){
            value = event.target.checked;
        }
        if(keyStyle === 'fontWeight'){
            value = event.target.checked ? 'bold':'';
        }
        if(keyStyle === 'fontStyle'){
            value = event.target.checked ? 'italic':'';
        }
        if (canvas && canvas.getActiveObject()) {
            // @ts-ignore
            canvas.getActiveObject().set(keyStyle, value);
            canvas.renderAll();
        }
        setData((prev)=>({...prev, canvas}))

    }

    /** функция изменяет размер выделенного текста */
    const handleChangeFontSize:ReturnType<TFUEditor>['handleChangeFontSize'] = (event)=>{
        const { canvas } = data;
        if (canvas && canvas.getActiveObject()) {
            // @ts-ignore
            canvas.getActiveObject().set("fontSize", event.target.value);
            canvas.renderAll();
        }
        setData((prev)=>({...prev, canvas, fontSize:event.target.value}))
    }

    /** функция удаляет активный элемент */
    const deleteActiveObject = useCallback(() => {
        const { canvas } = data;
        if(canvas){
            canvas.getActiveObjects().forEach((object) => {
                canvas.remove(object);
            });
            setData((prev)=>({...prev, canvas}))
        }
    },[data]);

    /** функция вызывает удаление активного елемента по нажатия на Delete */
    const onHandleKeyDown = (event:KeyboardEvent) => {
        if (event.code === 'Delete') {
            deleteActiveObject();
        }
    };

    /** функция скачаивает изображение на canvas */
    const handleDownload = () => {
        if(data.canvas){
            const image = data.canvas.toDataURL({
                format: "png",
                quality: 1
            });
            setData((prev)=>({...prev, href:image}))
        }
    };

    /** функция удаляет фон canvas */
    const handleRemoveBackground = () => {
        const { canvas } = data;
        if (canvas && canvas.backgroundImage) {

            // @ts-ignore
            canvas.setBackgroundImage(null);
            canvas.renderAll();
            setData((prev)=>({...prev, backgroundImage:'',canvas}))
        }
    };

    const handleOnChangeBackgroundColor:ReturnType<TFUEditor>['handleOnChangeBackgroundColor'] = (color) => {
        const { canvas } = data;
        handleRemoveBackground();
        if (canvas) {
            canvas.backgroundColor = color.hex;
            canvas.renderAll();
        }
        setData((prev)=>({...prev, canvas, backgroundColor:color.hex}))
    };

    /** функция добавляет фон по ссылке */
    const handleAddBackground:ReturnType<TFUEditor>['handleAddBackground'] = (url) => {
        const {canvas } = data;
        if(canvas){
            handleRemoveBackground();
            fabric.Image.fromURL(
                url,
                (img) => {
                    canvas.setBackgroundImage(
                        img,
                        () => {
                            canvas.renderAll();
                        },
                        {
                            scaleX: Number(canvas?.width) / (img && img.width ? img.width : 0),
                            scaleY: Number(canvas?.height) / (img && img.height ? img.height : 0)
                        }
                    );
                },
                { crossOrigin: "anonymous" }
            );
            setData((prev)=>({...prev, backgroundImage:url, canvas}));
            setIsModal(false);
        }
    };

    /** функция загружает локальное изображение с компьютера */
    const handleUploadImage:ReturnType<TFUEditor>['handleUploadImage'] = (event)=>{
        const { canvas } = data;
        if(canvas && event.target.files){
            const url = URL.createObjectURL(event.target.files[0]);
            fabric.Image.fromURL(
                url,
                (img) => {
                    canvas.add(img);
                    canvas.renderAll();
                },{ scaleX: 0.15, scaleY: 0.15 }
            );
        }
        setData((prev)=>({...prev, canvas}));
    }

    /** функция загрузки файла по ссылке */
    const handleUploadImageWithLink:ReturnType<TFUEditor>['handleUploadImageWithLink'] = ()=>{
        const {canvas, linkImage} = data;
        if(canvas && linkImage){
            fabric.Image.fromURL(
                linkImage,
                (img) => {
                    if(!img.getElement()?.src){
                        alert('неверная ссылка')
                     return;
                    }
                    canvas.add(img);
                    canvas.renderAll();
                },
                { scaleX: 0.15, scaleY: 0.15 }
            );
            setData((prev)=>({...prev, canvas, linkImage:''}))
        }
    }

    useLayoutEffect(()=>{
        const canvas = new fabric.Canvas("canvas", {
            backgroundColor: "#FDEFEF",
            height: container.current?.clientHeight ?? 500,
            width: container.current?.clientWidth ?? 500,
            preserveObjectStacking: true
        });
        setData((prev)=>({...prev, canvas}));
        return ()=>{
            document.removeEventListener("keydown", onHandleKeyDown);
        }
    },[]);

    useEffect(()=>{
        if(data.canvas){
            document.addEventListener("keydown", onHandleKeyDown);
        }
    },[data.canvas])

    return {
        state:data,
        container,
        handleAddText,
        handleDownload,
        handleRemoveBackground,
        handleAddBackground,
        handleChangeColor,
        handleChangeStyleText,
        handleChangeFontSize,
        handleUploadImage,
        handleOnChangeBackgroundColor,
        handleUploadImageWithLink,
        handleOnChangeLink,
        isModal,
        setIsModal,
    }
}