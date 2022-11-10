CHUNK_VAR_NAME = "webpackChunk_twitter_responsive_web";

HOOKS_NUMERIC = [
    ["main", 23629, hookAlpha23629]
];

function hookAlpha23629(orig_fn, e, t, n) {
    console.log("23629", arguments);

    let orig_nd = n.d;
    n.d = function(t, u) {
        this.d = orig_nd;
        function wrapped_Z() {
            let orig_a = u.Z.apply(this, arguments);
            
            function wrapped_a(e, t, n) {
                console.debug(e, t, n);
                
                if (e.is_blue_verified) {
                    console.info("TWID", e.id_str, "a.k.a. @"+e.screen_name, "has defected (Blue subscriber!)");
                    console.info("Are you following them?:", e.following);
                    console.info("Has NFT avatar?:", e.has_nft_avatar);
                }

                return orig_a.apply(this, arguments);
            }
            return wrapped_a;
        }

        return orig_nd.call(this, t, { Z: wrapped_Z });
    };

    let rv = orig_fn.call(this, e, t, n);
    n.d = orig_nd;

    console.log("23629-rv", rv);
    window.rv23629=[arguments, rv];
    return rv;
}

function installTrapChunk(varName) {
    console.log("Installing trap!");

    let trap = [];
    trap._real_push = Array.prototype.push;

    Object.defineProperty(trap, 'push', {
        enumerable: false,

        get: () => trapPush,
        set: (newPush) => {
            trap._real_push = newPush;
        }
      });

    window[varName] = trap;
}

function trapPush(value) {
    let moduleNames = value[0];
    let module = value[1];

    // try and find matching hooks
    for (const hook of HOOKS_NUMERIC) {
        if (moduleNames.includes(hook[0])) {
            console.debug("found hook", hook);
            
            let orig_fn = module[hook[1]];
            module[hook[1]] = function trampoline() {
                return hook[2].apply(this, [orig_fn].concat(Array.from(arguments)));
            }
        }
    }

    // now do the real push
    let pr = this._real_push;
    this._real_push = Array.prototype.push;
    
    let rv = pr.apply(this, [value]); // THIS IS WRONG LOL

    this._real_push = pr;

    return rv;
}

installTrapChunk(CHUNK_VAR_NAME);