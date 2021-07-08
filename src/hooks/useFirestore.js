import { useEffect, useState } from 'react'
import { db } from '../firebase/config'

const useFirestore = (collectionName, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        let collectionRef = db.collection(collectionName).orderBy('createAt');
        
        // condition
        /** 
         * {
         *      fieldName,
         *      operator,
         *      compareValue
         * }
         * 
         * */ 
        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                setDocuments([]);
                return;
            }
            const { fieldName, operator, compareValue } = condition;
            collectionRef = collectionRef.where(fieldName, operator, compareValue)
        }

        const unsubscribed = collectionRef.onSnapshot((snapshot) => {
            const documents = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setDocuments(documents)
        })
        return unsubscribed;
    }, [collectionName, condition]);

    return documents;
}

export default useFirestore;