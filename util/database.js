import * as SQLite from 'expo-sqlite';
import { Place } from '../models/places';
const database = SQLite.openDatabase('places.db');

// Function to initialize the database
export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS place (
                    id INTEGER PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL,
                    imageUri TEXT,
                    address TEXT NOT NULL,
                    lat REAL NOT NULL,
                    lng REAL NOT NULL 
                )`,
                [],
                () => {
                    resolve();
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

// Function to insert a new place into the database
export function insertPlace(place) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO place (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)',
                [
                    place.title,
                    place.imageUri,
                    place.address,
                    place.location.lat,
                    place.location.lng,
                ],
                (_, result) => {
                    console.log(result);
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchPlaces() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql('SELECT * FROM place',
                [],
                (_, result) => {
                    const places = [];
                    for (const db of result.rows._array) {
                        places.push(
                            new Place(
                                db.title,
                                db.imageUri,
                                {
                                    address: db.address,
                                    lat: db.lat,
                                    lng: db.lng
                                }, db.id));
                    }
                    resolve(places)
                },
                (_, error) => {
                    reject(error);
                });
        })


    })

    return promise
}

export function fetchPlaceDatails(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql('SELECT * FROM place WHERE id= ?',
                [id],
                (_, result) => {
                    const dbPlace = result.rows_array[0];
                    const place = new Place(dbPlace.title, dbPlace.imageUri, { lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address }, dbPlace.id)
                    resolve(place);
                },
                (_, error) => {
                    reject(error)
                })
        })

    })


}
