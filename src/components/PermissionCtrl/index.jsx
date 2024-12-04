import { useEffect, useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn";
import { ModalWindow } from "@/components/ModalWindow";
// style
import styles from "./permission.module.css"
// icon
import { FaMinus } from "react-icons/fa6";

export function PermissionCtrl({ id, permissionName, permissionId, permissionUpdate }) {
    
    // MARK:グループロール
    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        const fetchPermissions = async () => {
            const response = await fetch(`/api/db?table=permissions`);
            const permissions = await response.json();
            setPermissions(permissions);
        };
        fetchPermissions();
    }, [id]);

    // TODO: クリックでロール削除
    // TODO: Option変更で権限変更
    // TODO: 新しいロールのINSERT

    // セレクトのオプション切替
    const [valueSelect, setValueSelect] = useState(id)
    const handleChangeOption = (event) => {
        setOpenModal(true);
        setValueSelect(event.target.value);
    };
    
    // モーダル YES/NO
    const [openModal,setOpenModal] = useState(false)
    const handleModalNo = () => {
        setOpenModal(false);
    };
    const handleModalYes = async () => {
        await fetch(`/api/db?table=updPermission&id=${id}&new=${valueSelect}`);
        setOpenModal(false);
        permissionUpdate();
    };

    // 選択前:id, 選択後:valueSelect のIDから権限名を取得
    const getName = id => (
        permissions.find(
            permission => permission.id === parseInt(id)
        ) || {}).name || '';
    const beforeName = getName(id);
    const afterName = getName(valueSelect);

    return(
        <>  
        {/* MARK:モーダル */}
        {openModal && (
            <ModalWindow 
             permissionName={permissionName} 
             beforeName={beforeName} 
             afterName={afterName} 
             handleModalNo={handleModalNo} 
             handleModalYes={handleModalYes} 
            />
        )}

        <div className={styles.permission}>
            <div className={styles.left}>
                <div className={styles.role}>
                    <input 
                     type="text" 
                     placeholder="ロール名(変更)" 
                     value={permissionName} 
                     readOnly
                    />
                </div>
                <div className={styles.permit}>
                    <select 
                     className={styles.select} 
                     value={permissionId}
                     onChange={handleChangeOption}
                    >
                        {permissions.map((permission) => (
                            <option 
                             key={permission.id}
                             value={permission.id}
                            >
                                {permission.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.deleteBtn}>
                    <ImgBtn img={<FaMinus/>} />
                </div>
            </div>
        </div>
        </>
    )
}