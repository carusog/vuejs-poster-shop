const PRICE = 9.99;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        newSearch: 'blondes',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods: {
        onSubmit() {
            this.items = [];
            this.loading = true;
            this.$http.get(`/search/${this.newSearch}`)
            .then(function (result) {
                this.lastSearch = this.newSearch;
                this.items = result.data;
                this.loading = false;
            })
        },
        addItem(index) {
            this.total += PRICE;
            let found = false;
            let itemInCart = this.cart.find(item => item.id === this.items[index].id);

            if (itemInCart) {
                itemInCart.qty++;
            } else {
                this.cart.push({
                    id: this.items[index].id,
                    title: this.items[index].title,
                    price: PRICE,
                    qty: 1
                });
            }
        },
        inc(item) {
            item.qty++;
            this.total += PRICE;
        },
        dec(item) {
            item.qty--;
            this.total -= PRICE;
            if(item.qty === 0) {
                this.cart.forEach((product, index) => {
                   if(product.id === item.id) {
                        this.cart.splice(index, 1);
                        return;
                   }
                });
            }
        }
    },
    filters: { currency(price) {
            return `$${price.toFixed(2)}`;
        }
    },
    mounted() {
        this.onSubmit()
    }
});
