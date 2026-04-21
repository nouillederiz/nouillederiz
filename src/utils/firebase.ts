
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocFromServer, setDoc, deleteDoc, collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface ArticleData {
  id?: string;
  title: string;
  price: string;
  images: string[];
  createdAt?: number;
}

const ARTICLES_COLLECTION = 'articles';

export const getArticleConfig = async (id: string = 'default'): Promise<ArticleData | null> => {
  const docRef = doc(db, ARTICLES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as ArticleData;
  }
  return null;
};

export const getAllArticles = async (): Promise<ArticleData[]> => {
  const colRef = collection(db, ARTICLES_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleData));
};

export const saveArticleConfig = async (id: string, data: ArticleData) => {
  const docRef = doc(db, ARTICLES_COLLECTION, id);
  await setDoc(docRef, { ...data, createdAt: data.createdAt || Date.now() });
};

export const deleteArticleConfig = async (id: string) => {
  const docRef = doc(db, ARTICLES_COLLECTION, id);
  await deleteDoc(docRef);
};

export const subscribeToArticle = (id: string, callback: (data: ArticleData) => void) => {
  return onSnapshot(doc(db, ARTICLES_COLLECTION, id), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as ArticleData);
    }
  });
};

export const subscribeToAllArticles = (callback: (data: ArticleData[]) => void) => {
  const colRef = collection(db, ARTICLES_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleData));
    callback(articles);
  });
};
