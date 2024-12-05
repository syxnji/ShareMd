import { useEffect, useState } from "react";
// component
import { ImgBtn } from "@/components/UI/ImgBtn";
import { ModalWindow } from "@/components/ModalWindow";
// style
import styles from "./permission.module.css"
// icon
import { FaMinus } from "react-icons/fa6";

export function PermissionCtrl({ id, permissionName, permissionId, permissionUpdate }) {
    // TODO: クリックでロール削除
    // TODO: 新しいロールのINSERT
    
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

    // セレクトの表示値
    const [valueSelect, setValueSelect] = useState(id)
    
    // MARK: セレクト内オプションのトグル処理
    const [openModal,setOpenModal] = useState(false)
    const handleChangeOption = (event) => {
        setOpenModal(true);
        setValueSelect(event.target.value);
    }
    // YES
    const handleModalYes = async () => {
        await fetch(`/api/db?table=updPermission&id=${id}&new=${valueSelect}`);
        setOpenModal(false);
        permissionUpdate();
    };
    // NO
    const handleModalNo = () => {
        setOpenModal(false);
    };
    
    // MARK: 削除ボタンクリック処理
    const [openDeleteModal,setOpenDeleteModal] = useState(false)
    const handleDeleteRole = async () => {
        setOpenDeleteModal(true);
    }
    // YES
    const handleModalDeleteYes = async () => {
        await fetch(`/api/db?table=deleteRole&id=${id}`);
        setOpenModal(false);
        permissionUpdate();
    };
    // NO
    const handleModalDeleteNo = () => {
        setOpenDeleteModal(false);
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
             msg='本当に変更しますか？'
             name={permissionName} 
             before={beforeName} 
             after={afterName} 
             No={handleModalNo} 
             Yes={handleModalYes} 
            />
        )}
        {openDeleteModal && (
            <ModalWindow 
             msg='本当に削除しますか？'
             name={permissionName} 
             before={null}
             after={null} 
             No={handleModalDeleteNo} 
             Yes={handleModalDeleteYes} 
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
                    <ImgBtn img={<FaMinus/>} click={handleDeleteRole} />
                </div>
            </div>
        </div>
        </>
    )
}