'use client'
import { useCallback, useEffect, useState } from "react";
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
import { IoSaveOutline } from "react-icons/io5";

export function Permission({ display, id }) {
    
    // MARK:グループロール
    const [roles, setRoles] = useState([]);

    const fetchRoles = useCallback(async () => {
      const response = await fetch(`/api/db?table=groupRole&groupId=${id}`);
      const roles = await response.json();
      setRoles(roles);
    }, [id]);
  
    useEffect(() => {
      fetchRoles();
    }, [fetchRoles]);
    
    console.log(roles)

    return(
        <>
        <div className={ display ? styles.hideContent : styles.content }>

            {/* MARK:ロール表示 */}
            {roles.map((role) => (
                <PermissionCtrl 
                 key={role.id} 
                 id={role.id} 
                 permissionName={role.name} 
                 permissionId={role.permission_id}
                 permissionUpdate={fetchRoles}
                />
            ))}

            {/* MARK:新規ロール */}
            <form action="" method="post">
                <div className={stylePermit.addPermission}>
                    <div className={stylePermit.left}>
                        <div className={stylePermit.role}>
                            <input type="text" placeholder="ロール名を入力" />
                        </div>
                        <div className={stylePermit.permit}>
                            <select name="" id="" className={stylePermit.select}>
                                <option value="1">閲覧のみ</option>
                                <option value="2">編集可能</option>
                                <option value="3">全て</option>
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