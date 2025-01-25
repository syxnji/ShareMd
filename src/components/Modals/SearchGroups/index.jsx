import { BsFolder, BsX } from 'react-icons/bs';
import styles from './searchGroups.module.css';
import { ModalWindow } from '@/components/UI/ModalWindow';

export function SearchGroups({
    toggleModalSearchGroup, 
    handleSearchGroup, 
    searchGroup, 
    searchGroupResult, 
    handleRequestGroup
}){
    return (
        <ModalWindow>
            {/* 閉じるボタン */}
            <button className={styles.searchGroupClose} onClick={toggleModalSearchGroup}><BsX/></button>

            {/* コンテンツ */}
            <div className={styles.searchGroupContent}>

                {/* 検索フォーム */}
                <div className={styles.searchGroupForm}>
                    <label className={styles.searchGroupLabel}>グループ名で検索</label>
                    <input className={styles.searchGroupInput} type="text" placeholder="グループ名で検索" onChange={handleSearchGroup} value={searchGroup}/>
                </div>

                {/* 検索結果 */}
                <div className={styles.searchGroupResult}>
                    <label className={styles.searchGroupLabel}>検索結果</label>
                    <div className={styles.searchGroupList}>
                        {searchGroupResult.length > 0 ? (
                            searchGroupResult.map((group) => (
                                <div className={styles.group} key={group.id}>
                                    <div className={styles.groupIcon}>
                                        <BsFolder/>
                                    </div>
                                    <p className={styles.groupName}>{group.name}</p>
                                    <button className={styles.requestBtn} onClick={(e) => {handleRequestGroup(e, group.id, group.created_by);}}>参加リクエスト</button>
                                </div>
                            ))
                        ) : (
                            <div className={styles.group}>
                                <p>グループが見つかりません</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModalWindow>
    )
}