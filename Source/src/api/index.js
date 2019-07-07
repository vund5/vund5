import i18n from 'i18next';
// server dev
const serverURL = 'http://dienbien.darkvn.net';
const domain_ = 'dienbien.darkvn.net';
class DienBienAPI {

    getServerURL() {
        if (!!i18n.language) {
            switch (i18n.language) {
                case 'vi':
                    return serverURL;
                case 'en':
                    return serverURL + '/en';
                default:
                    return serverURL;
            }
        } else {
            return serverURL;
        }
    }

    getServerURLDefault() {
        return serverURL;
    }

    getDomain() {
        return domain_;
    }

    async getAllLocation(searchText, page) {
        let url = `${this.getServerURL()}/wp-json/wp/v2/vtdestination?per_page=10&page=${page}&orderby=title&order=asc`;
        if (searchText != "") {
            url += '&sk=' + searchText.replace(/ /g, "+");
        }
        try {
            let response = await this.fetch_timeout(
                url,
            )
            // let response = await fetch(
            //     url,
            // )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getAccountTokenSocial(_id, _email, _firstName, _lastName, _accountType, _token) {
        let url = this.getServerURL() + '/wp-json/v2/social-register';
        try {
            let response = await fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "username": _id + "",
                        "email": _email,
                        "firstname": _firstName,
                        "lastname": _lastName,
                        "accounttype": _accountType + "",
                        "token": _token
                    }),
                }
            )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getAllRestaurant(searchText, page) {
        let url = `${this.getServerURL()}/wp-json/wp/v2/vtrestaurant?per_page=10&page=${page}&orderby=title&order=asc`;
        if (searchText != "") {
            url += '&sk=' + searchText.replace(/ /g, "+");
        }
        //console.log(url);
        try {
            let response = await this.fetch_timeout(
                url,
            )
            // let response = await fetch(
            //     url,
            // )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getAllHotel(searchText, page) {
        let url = `${this.getServerURL()}/wp-json/wp/v2/vtproducts?per_page=10&page=${page}&orderby=title&order=asc`;
        if (searchText != "") {
            url += '&sk=' + searchText.replace(/ /g, "+");
        }
        //console.log(url);
        try {
            let response = await this.fetch_timeout(
                url,
            )
            // let response = await fetch(
            //     url,
            // )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getAllfestival(searchText, page) {
        let url = `${this.getServerURL()}/wp-json/wp/v2/vtqa?per_page=10&page=${page}&orderby=title&order=asc`;
        if (searchText != "") {
            url += '&sk=' + searchText.replace(/ /g, "+");
        }
        try {
            let response = await this.fetch_timeout(
                url,
            )
            // let response = await fetch(
            //     url,
            // )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getAllScheduleByCurrentUser(_token, self) {
        let url = this.getServerURL() + '/wp-json/v2/my-plantour';
        console.log(url);
        try {
            let response = await this.fetch_timeout(
                url,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + _token
                    },
                }
            )
            let responseJson = await response.json();
            console.log(responseJson)
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getDetailSchedule(_id) {
        let url = this.getServerURL() + '/wp-json/wp/v2/vtplantour/' + _id;
        try {
            let response = await this.fetch_timeout(
                url,
            )
            let responseJson = await response.json();
            //console.log(responseJson)
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getDetailMySchedule(_id) {
        let url = this.getServerURL() + '/wp-json/wp/v2/vtplantour/' + _id;
        try {
            let response = await this.fetch_timeout(
                url,
            )
            let responseJson = await response.json();
            //console.log(responseJson)
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getDetailLocation(_url) {
        try {
            let response = await fetch(
                _url,
            )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getDetailCategory() {
        let _url = this.getServerURL() + '/wp-json/wp/v2/vtplantour_group?per_page=99';
        try {
            let response = await fetch(
                _url,
            )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getDetailDate() {
        let _url = this.getServerURL() + '/wp-json/wp/v2/vtplantour_dates?per_page=99';
        try {
            let response = await fetch(
                _url,
            )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async getDetailCost() {
        let _url = this.getServerURL() + '/wp-json/wp/v2/vtplantour_cost?per_page=99';
        try {
            let response = await fetch(
                _url,
            )
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return null;
        }
    }

    async deleteScheduleByUser(_id, _token) {
        let url = this.getServerURL() + '/wp-json/v2/delete-plantour';
        try {
            let response = await this.fetch_timeout(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + _token
                    },
                    body: JSON.stringify({
                        "id": _id + ""
                    }),
                }
            )
            return response;
        } catch (error) {
            return null;
        }
    }

    async editScheduleByUser(data, _token) {
        let url = this.getServerURL() + '/wp-json/v2/update-plantour';
        try {
            // console.log(url);
            // console.log(_token);
            let response = await fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + _token
                    },
                    body: JSON.stringify(data),
                }
            )
            return response;;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async createScheduleByUser(data, _token) {
        let url = this.getServerURL() + '/wp-json/v2/create-plantour';
        try {
            // console.log(url);
            // console.log(_token);
            let response = await fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + _token
                    },
                    body: JSON.stringify(data),
                }
            )
            return response;;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async fetch_timeout(url, options = {}) {
        /*
         * fetches a request like the normal fetch function 
         * but with a timeout argument added.
         */
        let timeout = options.timeout || 10000;
        let timeout_err = {
            ok: false,
            status: 408
        };
        return new Promise(function(resolve, reject) {
            fetch(url, options).then(resolve, reject);
            setTimeout(reject.bind(null, timeout_err), timeout);
        });
    }
}

export default new DienBienAPI;