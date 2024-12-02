'use client'
import { useEffect, useState } from "react";
// component
import { GroupHeadline } from "@/components/GroupHeadline/index.jsx";
import { PermissionCtrl } from "@/components/PermissionCtrl/index.jsx";
import { MainBtn } from "@/components/UI/MainBtn";
import { ImgBtn } from "@/components/UI/ImgBtn";
// style
import styles from "@/pages/Library/library.module.css";
import stylePermit from "./permission.module.css";
// icon
import { FaPlus } from "react-icons/fa6";
import { IoReturnDownBack, IoSaveOutline } from "react-icons/io5";
import { BsFileEarmarkPlus, BsPeople } from "react-icons/bs";

export function Permission({display, group}) {
    
    // MARK:グループ権限
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const fetchRoles = async () => {
            const response = await fetch(`/api/db?table=groupRole`);
            const roles = await response.json();
            setRoles(roles);
        };
        fetchRoles();
    }, []);

    // BackBtn
    // const handleBack = () => {
    //     window.history.back();
    // };

    return(
        <>
        <div className={ display ? styles.hideContent : styles.content }>

            {/* permissions */}
            <PermissionCtrl />
            <PermissionCtrl />
            <PermissionCtrl />

            {/* add permission */}
            <form action="" method="post">
                <div className={stylePermit.addPermission}>
                    <div className={stylePermit.left}>
                        <div className={stylePermit.role}>
                            <input type="text" placeholder="ロール名" />
                        </div>
                        <div className={stylePermit.permit}>
                            <select name="" id="" className={stylePermit.select}>
                                <option value="viewer">閲覧のみ</option>
                                <option value="editor">編集可能</option>
                                <option value="all">全て</option>
                            </select>
                        </div>
                    </div>
                    <div className={stylePermit.right}>
                        <div className={stylePermit.deleteBtn}>
                            <ImgBtn img={<FaPlus />} />
                        </div>
                    </div>
                </div>
            </form>

            {/* saveBtn */}
            <div className={stylePermit.saveBtn}>
                <MainBtn img={<IoSaveOutline/>} text="Save"/>
            </div>

        </div>
        </>
    )
}