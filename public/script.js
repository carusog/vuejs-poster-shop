const PRICE = 9.99;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        newSearch: '70s',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    computed: {
        noMoreItems() {
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    methods: {
        appendItems() {
            if (this.items.length < this.results.length) {
                let partials = this.results.slice(this.items.length, this.items.length + 10);
                console.log(partials);
                // this.items.push(this.results.slice(this.items.length++, this.items.length + 10));
                this.items = this.items.concat(partials);
            }
        },
        onSubmit() {
            if (this.newSearch.length < 1) {
                return;
            }
            this.items = [];
            this.loading = true;
            this.$http.get(`/search/${this.newSearch}`)
            .then(function (result) {
                this.lastSearch = this.newSearch;
                this.results = result.data;
                this.items = result.data.slice(0, 10);
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
        let vueInstance = this;
        let elem = document.getElementById('product-list-bottom');
        let watcher = scrollMonitor.create(elem);
        watcher.enterViewport(() => {
            vueInstance.appendItems();
        })
    }
});
