'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// component
import { Menu } from "@/components/Menu/index.jsx";
import { GroupHeadline } from "@/components/GroupHeadline/index.jsx";
import { PermissionCtrl } from "@/components/PermissionCtrl/index.jsx";
import { MainBtn } from "@/components/UI/MainBtn";
import { ImgBtn } from "@/components/UI/ImgBtn";
// style
import styles from "../Library/library.module.css";
import stylePermit from "./permission.module.css";
// icon
import { FaPlus } from "react-icons/fa6";
import { IoReturnDownBack, IoSaveOutline } from "react-icons/io5";

export default function Permission() {
    const router = useRouter();
    const { id } = router.query;

    // MARK:グループ権限
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const fetchRoles = async () => {
            const response = await fetch(`/api/db?table=groupRole`);
            const allNotes = await response.json();
            setRoles(roles);
        };
        fetchRoles();
    }, []);

    // BackBtn
    const handleBack = () => {
        window.history.back();
    };

    // GroupHeadline
    const headLeft = (
        <>
        <p className={stylePermit.auth}>{ id }</p>
        <div className={stylePermit.backBtn}>
            <ImgBtn img={<IoReturnDownBack/>} click={handleBack} />
        </div>
        </>
    )

    return(
        <>
            <main className={styles.main}>

                <Menu />

                <div className={styles.content}>
                    {/* headline */}
                    <GroupHeadline headLeft={headLeft} />

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
            </main>
        </>
    )
}