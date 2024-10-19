function hasBadWord(n) {
    var t = new RegExp("\\b(" + bdwordsArr.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b","i");
    return t.test(n)
}
function ValidateBadWord() {
    var n = !1;
    return $("[data-validator='badwordchecker']").each(function() {
        var i = $(this).val()
          , t = $(this).parent().find('[data-attr="error-message"]');
        hasBadWord(i) ? (t.html("<i class='fas fa-exclamation-triangle'><\/i>Please remove bad words / offensive language."),
        n || (t.focus(),
        n = !0)) : t.text("")
    }),
    n ? !1 : void 0
}
function getLocation() {
    navigator.geolocation && navigator.geolocation.getCurrentPosition(showPosition, showError)
}
function manulDetectLocation() {
    navigator.geolocation && navigator.geolocation.getCurrentPosition(ManualDetectPosition, showError)
}
function showPosition(n) {
    var t = n.coords.latitude
      , i = n.coords.longitude;
    setnearbylocationautodetection(t, i)
}
function ManualDetectPosition(n) {
    var t = n.coords.latitude
      , i = n.coords.longitude;
    setnearbylocationautodetection(t, i, !0)
}
function showError(n) {
    switch (n.code) {
    case n.PERMISSION_DENIED:
        $('[data-attr="detectLocationbtntext"]').text("Detect my location");
        var t = $("#pushdetectmyloc").val();
        t === "true" && $("#locationDetectionError").modal("show")
    }
}
function splitotp(n) {
    if (n.length > 0) {
        var t = n.split("");
        $.each(t, function(n, t) {
            $("#notp" + n).val(t)
        })
    }
}
function isNumber(n) {
    n = n ? n : window.event;
    var t = n.which ? n.which : n.keyCode;
    return t > 31 && (t < 48 || t > 57) ? !1 : !0
}
function searchlog(n, t) {
    var r, i, u;
    let f = getLocalStorageItem("ud_srchid");
    r = window.location.href;
    i = parseInt(f);
    isNaN(i) || (u = {
        Lookingfor: n,
        LocationId: i,
        DisplayNameId: t === "" ? 0 : t,
        Url: r
    },
    $.ajax({
        url: rootUrl + "/iolajax/ajax/searchlog",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(u),
        success: function() {
            console.log("data Saved")
        },
        error: function(n) {
            console.error("Error loading partial view:", n)
        }
    }))
}
function SearchRedirection(n, t, i) {
    var r = getLocalStorageItem("ud_domain"), f = getLocalStorageItem("ud_islocality"), e = getLocalStorageItem("ud_url"), o, s, u, h;
    if (i == 10) {
        window.location.href = "https://" + n;
        return
    }
    if (o = readcookie("userid"),
    o !== null && o !== undefined) {
        if (s = $("#idcurrentdomain").val(),
        r != s) {
            if (f) {
                u = "https://" + r + "/" + n + "-in-" + e + "/" + t;
                h = infoutkn(u);
                return
            }
            u = "https://" + r + "/" + n + "/" + t;
            h = infoutkn(u);
            return
        }
        if (f) {
            window.location.href = "https://" + r + "/" + n + "-in-" + e + "/" + t;
            return
        }
        window.location.href = "https://" + r + "/" + n + "/" + t;
        return
    }
    if (f) {
        window.location.href = "https://" + r + "/" + n + "-in-" + e + "/" + t;
        return
    }
    window.location.href = "https://" + r + "/" + n + "/" + t;
    return
}
function setnearbylocationautodetection(n, t, i=false) {
    setLocalStorageItem("autodetected_loc", !0);
    $('[data-attr="btnsearch"]').prop("disabled", !0);
    $.ajax({
        url: rootUrl + "/iolajax/ajax/sugestednearbylocationlatlong",
        type: "POST",
        data: {
            targetlatitude: n,
            targetlongitude: t
        },
        success: function(n) {
            var t = n[0]
              , u = "";
            if ($('[data-attr="suggetsedlocation"]').empty(),
            n.length > 0) {
                $('[data-id="locnotfound"]').empty();
                n.forEach(function(n) {
                    u = '<li class="defaultLocationIcon" data-id="' + n.searchId + '" data-searchtype="' + n.searchType + '" data-cityid="' + n.cityid + '" data-lat="' + n.latitude + '" data-long="' + n.longitude + '" data-cityname="' + n.cityName + '" data-domain="' + n.cityDomain + '" data-url="' + n.url + '" data-complete-loc="' + n.displayName + '"><span>' + n.displayName + "<\/span><\/li>";
                    $('[data-attr="suggetsedlocation"]').append(u)
                });
                var e = t.cityName
                  , o = t.cityid
                  , r = t.displayName
                  , s = t.cityDomain
                  , h = t.searchType
                  , c = t.latitude
                  , l = t.longitude
                  , a = t.url
                  , v = t.searchId
                  , f = !1;
                h == 9 && (f = !0)
            }
            $('[data-loc="usrloc_mob"]').text(r);
            $('[data-loc-id="usrloc"]').val(r);
            $('[data-search-box-name="gblsearch"]').attr("placeholder", "Search in " + r);
            setVisitorlocationLocalStorage(o, e, r, s, a, c, l, f, v, n);
            $('[data-attr="detectLocationbtntext"]').text("Detect my location");
            i === !0 && ($(".backPage").trigger("click"),
            $('[data-search-box-name="gblsearch"]').focus(),
            $('[data-attr="gblSearchbox"]').trigger("click"));
            $('[data-attr="btnsearch"]').prop("disabled", !1)
        },
        error: function(n) {
            $('[data-attr="detectLocationbtntext"]').text("Detect my location");
            $('[data-attr="btnsearch"]').prop("disabled", !1);
            console.error("Error loading partial view:", n)
        }
    })
}
function Setdefaultlocationbydomain(n) {
    $.ajax({
        url: rootUrl + "/iolajax/ajax/setdefaultlocationbydomain",
        type: "POST",
        data: {
            domain: rootUrl
        },
        success: function(t) {
            var i = t[0];
            if ($('[data-attr="suggetsedlocation"]').empty(),
            t.length > 0) {
                $('[data-id="locnotfound"]').empty();
                t.forEach(function(n) {
                    lidata = '<li class="defaultLocationIcon" data-id="' + n.searchId + '" data-searchtype="' + n.searchType + '" data-cityid="' + n.cityid + '" data-lat="' + n.latitude + '" data-long="' + n.longitude + '" data-cityname="' + n.cityName + '" data-domain="' + n.cityDomain + '" data-url="' + n.url + '" data-complete-loc="' + n.displayName + '"><span>' + n.displayName + "<\/span><\/li>";
                    $('[data-attr="suggetsedlocation"]').append(lidata)
                });
                var f = i.cityName
                  , e = i.cityid
                  , r = i.displayName
                  , o = i.cityDomain
                  , s = i.searchType
                  , h = i.latitude
                  , c = i.longitude
                  , l = i.url
                  , a = i.searchId
                  , u = !1;
                s == 9 && (u = !0);
                $('[data-loc="usrloc_mob"]').text(r);
                $('[data-loc-id="usrloc"]').val(r);
                $('[data-search-box-name="gblsearch"]').attr("placeholder", "Search in " + r);
                setVisitorlocationLocalStorage(e, f, r, o, l, h, c, u, a, t)
            }
            n !== !1 && getLocation()
        },
        error: function(n) {
            console.error("Error loading partial view:", n)
        }
    })
}
function GetetrieveLocationListByStorage() {
    var t = getLocalStorageItem("uloclist"), i, n;
    t && (bindLocationList(t),
    i = t[0],
    n = i.displayName,
    $('[data-loc="usrloc_mob"]').text(n),
    $('[data-loc-id="usrloc"]').val(n),
    $('[data-search-box-name="gblsearch"]').attr("placeholder", "Search in " + n))
}
function bindLocationList(n) {
    $('[data-attr="suggetsedlocation"]').empty();
    $.each(n, function(n, t) {
        $('[data-attr="suggetsedlocation"]').append('<li class="defaultLocationIcon" data-id="' + t.searchId + '" data-searchtype="' + t.searchType + '" data-cityid="' + t.cityid + '" data-lat="' + t.latitude + '" data-long="' + t.longitude + '" data-cityname="' + t.cityName + '" data-domain="' + t.cityDomain + '" data-url="' + t.url + '" data-complete-loc="' + t.displayName + '"><span>' + t.displayName + "<\/span><\/li>")
    })
}
function setlocationListBylatlong(n, t) {
    $.ajax({
        url: rootUrl + "/iolajax/ajax/sugestednearbylocationlatlong",
        type: "POST",
        data: {
            targetlatitude: n,
            targetlongitude: t
        },
        success: function(n) {
            n.length > 0 && setLocalStorageItem("uloclist", n)
        },
        error: function(n) {
            console.error("Error loading partial view:", n)
        }
    })
}
function setVisitorlocationLocalStorage(n, t, i, r, u, f, e, o, s, h) {
    n && setLocalStorageItem("ud_cid", n);
    t && setLocalStorageItem("ud_cname", t);
    i && setLocalStorageItem("ud_loc", i);
    r && setLocalStorageItem("ud_domain", r);
    u && setLocalStorageItem("ud_url", u);
    f && setLocalStorageItem("ud_lat", f);
    e && setLocalStorageItem("ud_long", e);
    s && setLocalStorageItem("ud_srchid", s);
    h && setLocalStorageItem("uloclist", h);
    setLocalStorageItem("ud_islocality", o)
}
function bindSearchList(n, t) {
    $('[data-target="' + t + '"]').parents('[data-attr="gblSearchbox"]').next('[data-attr="gblsuggestionbox"]').show();
    var r = /\{([^}]*)\}/g
      , i = "https://assets.indiaonline.in/common/search-no-icon.png";
    $('[data-target="' + t + '"]').parents('[data-attr="gblSearchbox"]').next().find('[data-attr="suggetsedsearchlist"]').empty();
    n.forEach(function(n) {
        var u = "", l = n.referenceId, o = getLocalStorageItem("ud_loc"), f = n.displayName, s, h, c, e;
        n.searchType == 1 || n.searchType == 2 ? u = n.imageUrl != "" ? "https://assets.indiaonline.in/cat-icons/50/" + n.imageUrl : i : n.searchType == 3 ? u = n.imageUrl != "" ? "https://assets.indiaonline.in/brands/icon/30/" + n.imageUrl : i : n.searchType == 7 ? u = i : n.searchType == 10 ? (s = n.displayName,
        h = s.match(r),
        o = $.map(h, function(n) {
            return n.substring(1, n.length - 1)
        }),
        c = f.replace(r, ""),
        f = c,
        u = "https://assets.indiaonline.in/common/search-business-icon.png") : u = "https://assets.indiaonline.in/cat-default/60/" + n.imageUrl;
        e = "";
        e = '<li data-searchtype="' + n.searchType + '" data-id="' + n.searchId + '" data-refid="' + n.referenceId + '" data-domain="' + n.cityDomain + '" data-url="' + n.url + '" data-complete-loc="' + f + '"><span class="item"><img src="' + u + '" alt="' + f + '" class="iconCategory" /><span class="listContent"><span class="inputText">' + f + "<\/span>";
        e += '<span class="inputRelation" >' + o + "<\/span ><\/span> <\/span><\/li >";
        $('[data-target="' + t + '"]').parents('[data-attr="gblSearchbox"]').next().find('[data-attr="suggetsedsearchlist"]').append(e)
    })
}
function ShowOtpPopup(n, t) {
    $('[data-attr="otpmobno"]').text(n);
    $('[data-attr="OTPlblMsg"]').text(t);
    $('[data-id="verifyOtpBtn"]').attr("data-vmob", n);
    $("#verifyboxsOTP").modal("show")
}
function CreateUserStorage(n, t) {
    setLocalStorageItem("mobile", n);
    setLocalStorageItem("username", t)
}
function SendOtp(n, t, i, r="#loginRegister", u=false, f, e) {
    t = t ? t.replace(/\s+/g, " ").trim() : "";
    u || CreateUserStorage(n, t);
    var o = {
        mobile: n,
        name: t
    }
      , s = $('input[name="__RequestVerificationToken"]').val();
    $.ajax({
        url: rootUrl + "/iolajax/ajax/sendotp",
        type: "POST",
        contentType: "application/json",
        headers: {
            RequestVerificationToken: s
        },
        data: JSON.stringify(o),
        success: function(t) {
            t.success ? (u || ($(r).modal("hide"),
            ShowOtpPopup(n, i)),
            typeof f == "function" && (f.name === "sendEnquiry" ? ($("#categoryBaseEnquiryForm").modal("hide"),
            $("#basicEnquiryForm").modal("hide"),
            $("#profileThankyou").modal("hide"),
            sendEnquiry(e)) : f.name === "PostReview" && PostReview(e))) : console.info("Failed to send OTP. Please try again. " + t)
        }
    })
}
function infoutkn(n) {
    var t = readcookie("mobile")
      , i = $('input[name="__RequestVerificationToken"]').val()
      , r = {
        mobile: t
    };
    $.ajax({
        url: rootUrl + "/iolajax/ajax/infoutkn",
        type: "POST",
        contentType: "application/json",
        headers: {
            RequestVerificationToken: i
        },
        data: JSON.stringify(r),
        success: function(t) {
            var i = t.userData;
            n !== "" && (window.location.href = i === undefined || i === null ? n : n + "?atn=" + i)
        }
    })
}
function isMobileNumberExists(n) {
    /^\d{10}$/.test(n) && $.ajax({
        url: rootUrl + "/iolajax/ajax/getuserinfobymobileno",
        type: "GET",
        contentType: "application/json",
        data: {
            mobile: n
        },
        success: function(t) {
            if (t !== null) {
                var i = t.userData;
                return SendOtp(n, i.fullName, "Welcome back " + i.fullName + ", enter OTP to continue"),
                !0
            }
        },
        error: function() {}
    })
}
function isValidOtp(n, t, i, r) {
    var s = $('input[name="__RequestVerificationToken"]').val(), f = "", e = window.location.href, u, o;
    if (e.indexOf("/grow-your-business/ref-") !== -1 && (u = e.match(/ref-(\d{10})/),
    u && u.length > 1 && (f = u[1])),
    /^\d{4}$/.test(n) && /^\d{10}$/.test(t))
        o = {
            mobile: t.toString(),
            otpcode: n,
            refmobile: f
        },
        $.ajax({
            url: rootUrl + "/iolajax/ajax/verifyotp",
            type: "POST",
            contentType: "application/json",
            headers: {
                RequestVerificationToken: s
            },
            data: JSON.stringify(o),
            success: function(n) {
                setTimeout(function() {
                    var u, h, s, t, f;
                    if (HideProgressLoader('[data-id="verifyOtpBtn"]', "Verify"),
                    n.success === !1)
                        return $('[data-id="otplablerr"]').text("Invalid OTP"),
                        !1;
                    if (u = window.location.href,
                    u.indexOf("/my-listing") !== -1)
                        return window.location.href = rootUrl + "/my-listing",
                        !1;
                    if ($('[data-attr="headerNav"]').html('<li class="user"><a data-bs-toggle="offcanvas" title="' + readcookie("username") + '" href="#offcanvasUserMenu" aria-controls="offcanvasUserMenu"><span class="alphabetBlock">' + readcookie("username")[0] + "<\/span><\/a><\/li>"),
                    $('[data-attr="offcanvasUserMenu"]').html(n),
                    $('[data-attr="uname"]').text(readcookie("username")),
                    $('[data-attr="enqusrname"]').text("Hi " + readcookie("username") + ", "),
                    $('[data-attr="basicenqpopuptitile"]').html("Hi " + readcookie("username") + ", "),
                    $('[data-attr="mobsec"]').hide(),
                    $('[data-attr="namesec"]').hide(),
                    $("#verifyboxsOTP").modal("hide"),
                    $('[data-attr="loginfooterlink"]').remove(),
                    $(".formFieldBlock:last-child").show(),
                    typeof i == "function" && i.name === "commonenquirythankyou" && commonenquirythankyou(r),
                    i === "businessEnquiryThankyou" ? (h = getLocalStorageItem("blid"),
                    s = "",
                    $.each(h, function(n, t) {
                        n == 0 && (s = t)
                    }),
                    t = {
                        bid: s
                    },
                    ViewNumber("businessEnquiryThankyou", t)) : i === "profileenquirythankyou" ? commonenquirythankyou(t) : i === "viewnumber" ? isMobile() ? (t = {
                        bid: r,
                        targetObject: '[data-call="' + r + '"]'
                    },
                    ViewNumber("call", t)) : (t = {
                        bid: r,
                        targetObject: '[data-viewnum="' + r + '"]'
                    },
                    ViewNumber("shownumber", t)) : i === "chatwithowner" ? (t = {
                        bid: r,
                        targetObject: '[data-chat="' + r + '"]'
                    },
                    ViewNumber("chat", t)) : i && i.name === "call2Owner" && (t = {
                        bid: r,
                        targetObject: '[data-call="' + r + '"]'
                    },
                    ViewNumber("call", t)),
                    (u.indexOf("/grow-your-business") !== -1 || u.indexOf("/thankyou") !== -1) && (f = getLocalStorageItem("referral"),
                    f !== undefined && f !== null && f === "growyourbusiness")) {
                        $("#takingyoutoredirectionLoader").modal("show");
                        var v = getLocalStorageItem("pid")
                          , c = getLocalStorageItem("ptype")
                          , l = $("#idcurrentdomain").val()
                          , e = "list-your-business"
                          , o = $('[data-id="hdnredirectdomain"]').val()
                          , a = getLocalStorageItem("mobile");
                        $.ajax({
                            url: rootUrl + "/iolajax/ajax/getselectedplaninfo",
                            type: "GET",
                            contentType: "application/json",
                            data: {
                                mobile: a,
                                ptype: c
                            },
                            success: function(n) {
                                var t, i, r;
                                typeof n.redirect != "undefined" && n.redirect === !0 ? ($('[data-id="imageloaderDefault"]').show(),
                                n.url !== undefined && n.url !== null && (o = n.url,
                                t = n.isActive,
                                e = t ? "my-listing" : "list-your-business"),
                                l != o ? (i = "https://" + o + "/" + e,
                                r = infoutkn(i)) : window.location.href = "https://" + o + "/" + e) : ($("#takingyoutoredirectionLoader").modal("hide"),
                                $('[data-attr="growpagecartsummery"]').empty(),
                                $('[data-attr="growpagecartsummery"]').append(n),
                                $("#cartPopup").modal("show"))
                            }
                        })
                    }
                }, 1e3)
            },
            error: function() {
                return HideProgressLoader('[data-id="verifyOtpBtn"]', "Verify"),
                console.info("Error verifying OTP. Please try again."),
                $('[data-id="otplablerr"]').text("Invalid OTP"),
                !1
            }
        });
    else
        return HideProgressLoader('[data-id="verifyOtpBtn"]', "Verify"),
        $('[data-id="otplablerr"]').text("Invalid OTP"),
        !1
}
function isMobile() {
    return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
function editUser(n) {
    $("#userName-" + n).hide();
    $("[data-editbtnid='userName-" + n + "']").hide();
    $("#editDiv-" + n).show()
}
function saveUser(n) {
    var r = $('input[name="__RequestVerificationToken"]').val(), t = $("#editName-" + n).val(), i;
    t = t ? t.replace(/\s+/g, " ").trim() : "";
    i = {
        userId: n,
        userName: t
    };
    $.ajax({
        url: rootUrl + "/iolajax/ajax/changename",
        type: "POST",
        contentType: "application/json",
        headers: {
            RequestVerificationToken: r
        },
        data: JSON.stringify(i),
        success: function() {
            setLocalStorageItem("username", t);
            $("[data-editbtnid='userName-" + n + "']").show();
            $("#userName-" + n).text(t).show();
            $("#editDiv-" + n).hide()
        },
        error: function() {
            console.info("Error updating name.")
        }
    })
}
function readcookie(n) {
    for (var t, r = n + "=", u = document.cookie.split(";"), i = 0; i < u.length; i++) {
        for (t = u[i]; t.charAt(0) == " "; )
            t = t.substring(1, t.length);
        if (t.indexOf(r) == 0)
            return decodeURIComponent(t.substring(r.length, t.length))
    }
    return null
}
function deleteCookie(n) {
    setCookie(n, "", -1)
}
function setLocalStorageItem(n, t) {
    localStorage.setItem(n, JSON.stringify(t))
}
function getLocalStorageItem(n) {
    var t = localStorage.getItem(n);
    return t ? JSON.parse(t) : null
}
function isValidName(n, t) {
    var i = n.val(), r;
    return i.length < 2 ? (t.html('<i class="fas fa-exclamation-triangle"><\/i> Enter Your Name'),
    !1) : i.length > 30 ? (t.html('<i class="fas fa-exclamation-triangle"><\/i> Enter Your Name'),
    !1) : (r = /^[a-zA-Z\s]+$/.test(i),
    r ? !0 : (t.html('<i class="fas fa-exclamation-triangle"><\/i> Enter Valid Name'),
    !1))
}
function isValidMobile(n, t) {
    var i = n.val();
    return i.length === 0 ? (t.html('<i class="fas fa-exclamation-triangle"><\/i> Enter Your Mobile Number'),
    !1) : i.length != 10 || /[^0-9]/g.test(i) || /0{10}/.test(i) || /1{10}/.test(i) || /2{10}/.test(i) || /3{10}/.test(i) || /4{10}/.test(i) || /5{10}/.test(i) || /6{10}/.test(i) || /7{10}/.test(i) || /8{10}/.test(i) || /9{10}/.test(i) ? (t.html('<i class="fas fa-exclamation-triangle"><\/i> Invalid Mobile Number'),
    !1) : !0
}
function isValidEmail(n, t) {
    var i = n.val();
    return i.length === 0 ? (t.html('<i class="fas fa-exclamation-triangle"><\/i> Enter Your email address'),
    !1) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i) ? !0 : (t.html('<i class="fas fa-exclamation-triangle"><\/i> Invalid email address'),
    !1)
}
function showloader() {
    $("#loaderDefault").fadeIn("fast")
}
function ValidMobileNumber(n) {
    return /^[0-9]{10}$/.test(n)
}
function Hideloader() {
    setTimeout(function() {
        $("#loaderDefault").fadeOut("fast")
    }, 1e3)
}
function parstLatlongformat(n) {
    return parseFloat(n.replace(/"/g, ""))
}
function ShowProgressLoader(n, t) {
    $(n).html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"><\/span> ' + t + " ...").attr("disabled", !0)
}
function HideProgressLoader(n, t) {
    setTimeout(function() {
        $(n).html(t).attr("disabled", !1)
    }, 500)
}
function startTimer() {
    var n = timerDuration;
    updateTimerDisplay(n);
    timerInterval = setInterval(function() {
        if (n--,
        updateTimerDisplay(n),
        n <= 0) {
            clearInterval(timerInterval);
            var t = $('[data-attr="resendattempt"]').val()
              , i = parseInt(t, 10);
            i >= 2 ? $(".verify-member").html("<span class='notReceiveCode'>Please try again later<\/span>") : $("[data-id='resendOtpBtn']").prop("disabled", !1)
        }
    }, 1e3)
}
function updateTimerDisplay(n) {
    const t = n < 10 ? "0" + n : n;
    n > 0 ? $("#timer").html("in <span class='count'>" + t + "<\/span> seconds") : $("#timer").html("")
}
function resetTimer() {
    clearInterval(timerInterval);
    $("[data-id='resendOtpBtn']").prop("disabled", !0);
    updateTimerDisplay(timerDuration);
    startTimer()
}
var isDesktop, rootUrl, timerDuration, timerInterval, luid;
const bdwordsArr = ["pudhi", "potty", "madarchod", "paid sex", "massage sex", "sex with massage", "sex massage", "madar chod", "chod", "nuru", "landh", "rand", "chutiya", "ben chod", "behanchod", "behenchod", "behen chod", "behan chod", "behn chod", "chodu", "adult chat", "adult dating", "amateur", "anal", "ass", "babe", "babes", "bbw", "bdsm", "bisexual", "blonde", "blowjob", "blow job", "rimming", "oral sex", "cocksucking", "boobs", "brunette", "bukkake", "busty", "butt", "butt plug", "butts", "chicks", "clitoris", "cock", "cockring", "cocksucking", "dick", "dildo", "erotic", "erotica", "erotik", "fingering", "foreplay", "fuck", "fucking", "gangbang", "gay", "group sex", "handjobs", "hardcore", "hentai", "hoe", "horny", "impotence", "kinky", "kissing", "lesbain", "lesbian", "lezbain", "lezbian", "lezz", "masturbation", "naked", "naughty", "nipple", "nudists", "nudity", "nympho", "old porn", "orgasm", "orgies", "orgy", "porn", "porn pics", "porno", "pornography", "pornstars", "prostitu", "pussy", "sex lotion", "sex stories", "sex toys", "sexy", "shemale", "slut", "sologirl", "strip", "strip club", "strippers", "striptease", "threesome", "tits", "titties", "topless", "transexual", "transgender", "upskirt", "vagina", "whore", "xrated", "ahole", "anus", "ash0le", "ashole", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "asshole", "assholez", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "butthole", "buttwipe", "cock", "cocks", "cok", "c0ck", "c0cks", "c0k", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "dild0", "dildos", "dild0s", "dilld0", "dilldo", "dilld0s", "dilldos", "dominatricks", "dominatrics", "dominatrix", "f u c k", "f u c k e r", "fucker", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuckin", "fucks", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "go0k", "g0ok", "gook", "gayboy", "gaygirl", "gays", "gayz", "God-damned", "h00r", "ho0r", "h0or", "hoor", "h0ar", "hoar", "h0re", "hore", "hells", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "Lesbian", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger", "nigur", "niigr", "niiger", "orafis", "orgasim", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "xxx", "b!+ch", "clit", "arschloch", "b!tch", "b17ch", "b1tch", "bi+ch", "boiolas", "buceta", "cawk", "chink", "cipa", "clits", "cunt", "dirsa", "ejakulate", "fatass", "hoer", "jism", "kawk", "l3itch", "l3i+ch", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nutsack", "pimpis", "sh!t", "shi+", "sh!+", "smut", "teets", "b00bs", "teez", "testical", "titt", "wank", "whoar", "*damn", "*dyke", "fuck", "shit", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "butt-pirate", "cabron", "$manish@", "@raj$", "chut", "laude", "laude ke baal", "chinaal", "randi", "ludekebaal", "bhenchod", "lawde", "maakichut", "bhosad papu", "bhosadiki", "bhadwa", "badve", "choodu", "chodu", "gaand ke baal", "gand ke baal", "chutmarike", "Baap ke lavde", "maa ki chut", "Betichod", "Bhai Chhod", "bhayee chod", "bhaynchod", "Chopre he randi", "Chudasi", "chod", "harami", "cazzo", "chuj", "ejackulate", "Ekto", "enculer", "faen", "hell", "helvete", "honkey", "kuk", "kuksuger", "lesbo", "mamhoon", "mibun", "muschi", "p0rn", "pr0n", "screw", "b00b", "bullshit", "virgin", "virginity", "bollocks", "bondage", "boner", "bugger", "bum", "cumsucker", "dink", "dipshit", "dong", "douche", "douchebag", "fellatio", "gaylord", "goddamn", "homo", "hooker", "incest", "jackass", "jerk", "piss", "prick", "pube", "STFU", "FUCK", "twat", "wanker", "WTF", "Aand", "Baapchod", "Bable", "Badir", "badirchand", "Bakarchod", "Baklund", "Bhosda", "bhosde", "Bhund", "Bulla", "Chhake", "chut", "Choot ke baal", "Choot marike", "Chutya", "chutiya", "chutiyapa", "Gaand masti", "Gaand", "Genda", "Haggu", "Hijde", "Hijda", "hijra", "hinjra", "hinjda", "Jhaat", "Lukha", "Kamine", "Kutta", "Lavde ka baal", "Lavdu", "Lund", "Lund ke baal", "Lundfakir", "Moot", "Mooth", "Mutthal", "Naajayaz", "Pucchi", "Saallle", "Sandaas", "Suhar", "Tatti", "aaiiiichi gand", "gand", "melya", "bhosadpapu", "s e x", "raja", "kutra", "kamina", "madar", "m a d a r c h o d", "b e n c h o d", "bhosadike", "b e h e n c h o d", "sucker", "suck", "s u c k", "boo", "b 0 o", "b o 0", "b00", "randi", "rand", "maa ki aankh", "maa ki ankh", "chomu", "jhatu", "jhaatu", "gand k baal", "gand k ball", "babla", "gand", "gaandh", "w.t.f", "bablaa", "moron", "scoundrel", "halkat", "hulkat", "Saala", "saali", "kamina", "kamini", "chu*", "choot", "kutti", "kutre", "kutri", "melya", "aunty sex", "butt", "spoilt brat", "Fuck", "kutte", "kiss my ass", "Adult chat", "pinch my nipples", "dildo", "MILF", "Call Girl", "Call Girls", "Escort", "male escort", "gigolo", "Live sex", "live sex cam", "Whatsapp sex", "video sex", "video call sex", "nude dance", "college girl", "girl sex", "Sex Chat", "Phone Sex", "stripping", "Callgirl", "A-Level", "Strip-tease", "striptease", "BBBJ", "Bareback Blowjob", "COF", "Come On Face", "Cum on face", "DATY", "Doggie", "threesome", "Hand Job", "Handjob", "69 sex", "BJ", "GFE", "CBJ", "Come On Body", "Cum on Body", "Extraball", "Girlfriend experience", "muh mein le", "badman", "2g1c", "2 girls 1 cup", "acrotomophilia", "alabama hot pocket", "alaskan pipeline", "anal", "anilingus", "apeshit", "arsehole", "ass", "asshole", "assmunch", "auto erotic", "autoerotic", "babeland", "baby batter", "baby juice", "ball gag", "ball gravy", "ball kicking", "ball licking", "ball sack", "ball sucking", "bangbros", "bangbus", "bareback", "barely legal", "barenaked", "bastard", "bastardo", "bastinado", "bbw", "bdsm", "beaner", "beaners", "beaver cleaver", "beaver lips", "beastiality", "bestiality", "big black", "big breasts", "big knockers", "big tits", "bimbos", "birdlock", "bitch", "bitches", "black cock", "blonde action", "blonde on blonde action", "blowjob", "blow job", "blow your load", "blue waffle", "blumpkin", "bollocks", "bondage", "boner", "boob", "boobs", "booty call", "brown showers", "brunette action", "bukkake", "bulldyke", "bullet vibe", "bullshit", "bung hole", "bunghole", "busty", "butt", "buttcheeks", "butthole", "camel toe", "camgirl", "camslut", "camwhore", "carpet muncher", "carpetmuncher", "chocolate rosebuds", "cialis", "circlejerk", "cleveland steamer", "clit", "clitoris", "clover clamps", "clusterfuck", "cock", "cocks", "coprolagnia", "coprophilia", "cornhole", "coon", "coons", "creampie", "cum", "cumming", "cumshot", "cumshots", "cunnilingus", "cunt", "darkie", "date rape", "daterape", "deep throat", "deepthroat", "dendrophilia", "dick", "dildo", "dingleberry", "dingleberries", "dirty pillows", "dirty sanchez", "doggie style", "doggiestyle", "doggy style", "doggystyle", "dog style", "dolcett", "domination", "dominatrix", "dommes", "donkey punch", "double dong", "double penetration", "dp action", "dry hump", "dvda", "eat my ass", "ecchi", "ejaculation", "erotic", "erotism", "escort", "eunuch", "fag", "faggot", "fecal", "felch", "fellatio", "feltch", "female squirting", "femdom", "figging", "fingerbang", "fingering", "fisting", "foot fetish", "footjob", "frotting", "fuck", "fuck buttons", "fuckin", "fucking", "fucktards", "fudge packer", "fudgepacker", "futanari", "gangbang", "gang bang", "gay sex", "genitals", "giant cock", "girl on", "girl on top", "girls gone wild", "goatcx", "goatse", "god damn", "gokkun", "golden shower", "goodpoop", "goo girl", "goregasm", "grope", "group sex", "g-spot", "g spot", "guro", "hand job", "handjob", "hard core", "hardcore", "hentai", "homoerotic", "honkey", "hooker", "horny", "hot carl", "hot chick", "how to kill", "how to murder", "huge fat", "humping", "incest", "intercourse", "jack off", "jail bait", "jailbait", "jelly donut", "jerk off", "jigaboo", "jiggaboo", "jiggerboo", "jizz", "juggs", "kike", "kinbaku", "kinkster", "kinky", "knobbing", "leather restraint", "leather straight jacket", "lemon party", "livesex", "lolita", "lovemaking", "make me come", "male squirting", "masturbate", "masturbating", "masturbation", "menage a trois", "milf", "missionary position", "mong", "motherfucker", "mound of venus", "mr hands", "muff diver", "muffdiving", "nambla", "nawashi", "negro", "neonazi", "nigga", "nigger", "nig nog", "nimphomania", "nipple", "nipples", "nsfw", "nsfw images", "nude", "nudity", "nutten", "nympho", "nymphomania", "octopussy", "omorashi", "one cup two girls", "one guy one jar", "orgasm", "orgy", "paedophile", "paki", "pedobear", "pedophile", "pegging", "phone sex", "piece of shit", "pikey", "pissing", "piss pig", "pisspig", "playboy", "pleasure chest", "pole smoker", "ponyplay", "poof", "poon", "poontang", "punany", "poop chute", "poopchute", "porn", "porno", "pornography", "prince albert piercing", "pthc", "pubes", "pussy", "queaf", "queef", "quim", "raghead", "raging boner", "rape", "raping", "rapist", "recturectum", "reverse cowgirl", "rimjob", "rimming", "rosy palm", "rosy palm and her 5 sisters", "rusty trombone", "sadism", "santorum", "scat", "schlong", "scissoring", "sexcam", "sexo", "sexy", "sexually", "sexuality", "shaved beaver", "shaved pussy", "shemale", "shibari", "shit", "shitblimp", "shitty", "shota", "shrimping", "skeet", "slanteye", "slut", "s&m", "smut", "snatch", "snowballing", "sodomize", "sodomy", "spastic", "spic", "splooge", "splooge moose", "spooge", "spread legs", "spunk", "strap on", "strapon", "strappado", "strip club", "style doggy", "suck", "sucks", "suicide girls", "sultry women", "swastika", "swinger", "tainted love", "taste my", "tea bagging", "threesome", "throating", "thumbzilla", "tied up", "tight white", "tit", "tits", "titties", "titty", "tongue in a", "topless", "tosser", "towelhead", "tranny", "tribadism", "tub girl", "tubgirl", "tushy", "twat", "twink", "twinkie", "two girls one cup", "undressing", "upskirt", "urethra play", "urophilia", "vagina", "venus mound", "viagra", "vibrator", "violet wand", "vorarephilia", "voyeur", "voyeurweb", "voyuer", "vulva", "wank", "wetback", "wet dream", "white power", "whore", "worldsex", "wrapping men", "wrinkled starfish", "xx", "xxx", "yaoi", "yellow showers", "yiffy", "zoophilia", "allah", "alligatorbait", "amateur", "analannie", "analsex", "angie", "arouse", "arse", "assassin", "assassinate", "assassination", "assbagger", "assblaster", "assclown", "asscowboy", "asses", "assfuck", "assfucker", "asshat", "assholes", "asshore", "assjockey", "asskiss", "asskisser", "assklown", "asslick", "asslicker", "asslover", "assman", "assmonkey", "assmuncher", "asspacker", "asspirate", "asspuppies", "assranger", "asswhore", "asswipe", "attack", "babe", "badfuck", "balllicker", "ballsack", "banging", "baptist", "barelylegal", "barf", "barface", "barfface", "bastard ", "bazongas", "bazooms", "beast", "beastality", "beastial", "beatyourmeat", "beaver", "bestial", "biatch", "bicurious", "bigass", "bigbastard", "bigbutt", "bisexual", "bi-sexual", "bitcher", "bitchez", "bitchin", "bitching", "bitchslap", "bitchy", "biteme", "blackman", "boang", "body to body", "body-to-body", "bogan", "bohunk", "bollick", "bollock", "bombers", "bombing", "bomd", "bong", "boobies", "booby", "boody", "boom", "boong", "boonga", "boonie", "booty", "bootycall", "bountybar", "brea5t", "breastjob", "breastlover", "breastman", "brothel", "bugger", "buggered", "buggery", "bullcrap", "bulldike", "bumblefuck", "bumfuck", "bunga", "butchbabes", "butchdike", "butchdyke", "buttbang", "butt-bang", "buttface", "buttfuck", "butt-fuck", "buttfucker", "butt-fucker", "buttfuckers", "butt-fuckers", "butthead", "buttman", "buttmunch", "buttmuncher", "buttpirate", "buttplug", "buttstain", "byatch", "cacker", "cameljockey", "cameltoe", "carruth", "chav", "cherrypopper", "chickslick", "chinaman", "chinamen", "chink", "chinky", "choad", "chode", "cigarette", "cigs", "clamdigger", "clamdiver", "clogwog", "cocaine", "cockblock", "cockblocker", "cockcowboy", "cockfight", "cockhead", "cockknob", "cocklicker", "cocklover", "cocknob", "cockqueen", "cockrider", "cocksman", "cocksmith", "cocksmoker", "cocksucer", "cocksuck ", "cocksucked ", "cocksucker", "cocksucking", "cocktail", "cocktease", "cocky", "cohee", "coitus", "commie", "cooly", "coondog", "cra5h", "crackpipe", "crackwhore", "crack-whore", "crap", "crapola", "crapper", "crappy", "crotch", "crotchjockey", "crotchmonkey", "crotchrot", "cumbubble", "cumfest", "cumjockey", "cumm", "cummer", "cumquat", "cumqueen", "cunilingus", "cunillingus", "cunn", "cunntt", "cunteyed", "cuntfuck", "cuntfucker", "cuntlick ", "cuntlicker ", "cuntlicking ", "cuntsucker", "cybersex", "cyberslimer", "dago", "dahmer", "dammit", "damn", "damnation", "damnit", "darky", "datnigga", "dead", "deapthroat", "defecate", "dego", "demon", "destroy", "deth", "devil", "devilworshipper", "dickbrain", "dickforbrains", "dickhead", "dickless", "dicklick", "dicklicker", "dickman", "dickwad", "dickweed", "diddle", "dike", "dink", "dipshit", "dipstick", "dix", "dixiedike", "dixiedyke", "dong", "doodoo", "doo-doo", "doom", "dope", "dragqueen", "dragqween", "dripdick", "drunk", "drunken", "dumb", "dumbass", "dumbbitch", "dumbfuck", "dyefly", "dyke", "easyslut", "eatballs", "eatme", "eatpussy", "ecstacy", "enemy", "ero", "evl", "excrement", "facefucker", "faeces", "fagging", "fagot", "fannyfucker", "fart", "farted ", "farting ", "farty ", "fastfuck", "fatah", "fatass", "fatfuck", "fatfucker", "fatso", "fckcum", "feces", "felatio ", "felcher", "felching", "feltcher", "feltching", "fetish", "filipina", "filipino", "fingerfood", "fingerfuck ", "fingerfucked ", "fingerfucker ", "fingerfuckers", "fingerfucking ", "fister", "fistfuck", "fistfucked ", "fistfucker ", "fistfucking ", "flange", "flasher", "floo", "flydie", "flydye", "fok", "fondle", "footaction", "footfuck", "footfucker", "footlicker", "footstar", "forni", "fornicate", "foursome", "fourtwenty", "freakfuck", "freakyfucker", "freefuck", "fu", "fubar", "fuc", "fucck", "f u c k", "fucka", "fuckable", "fuckbag", "fuckbuddy", "fucked", "fuckedup", "fucker", "fuckers", "fuckface", "fuckfest", "fuckfreak", "fuckfriend", "fuckhead", "fuckher", "fuckina", "fuckingbitch", "fuckinnuts", "fuckinright", "fuckit", "fuckknob", "fuckme ", "fuckmehard", "fuckmonkey", "fuckoff", "fuckpig", "fucks", "fucktard", "fuckwhore", "fuckyou", "fugly", "fuk", "fuks", "funfuck", "fungus", "fuuck", "gangbanged ", "gangbanger", "gangsta", "gatorbait", "gay", "gaymuthafuckinwhore", "gaysex ", "geez", "geezer", "getiton", "ginzo", "gipp", "givehead", "glazeddonut", "gob", "godammit", "goddamit", "goddammit", "goddamn", "goddamned", "goddamnes", "goddamnit", "goddamnmuthafucker", "goldenshower", "gonorrehea", "gonzagas", "gook", "gotohell", "goy", "goyim", "greaseball", "gringo", "groe", "grostulation", "gubba", "gummer", "gun", "gyp", "gypo", "gypp", "gyppie", "gyppo", "gyppy", "hamas", "hapa", "hardon", "harem", "headfuck", "hebe", "heeb", "hell", "henhouse", "heroin", "hijack", "hijacker", "hijacking", "hillbillies", "hindoo", "hiscock", "hitler", "hitlerism", "hitlerist", "hobo", "hodgie", "hoes", "holestuffer", "homicide", "homo", "homobangers", "homosexual", "honger", "honk", "honkers", "honky", "hookers", "hooters", "hore", "hork", "horney", "horniest", "horseshit", "hosejob", "hoser", "hostage", "hotdamn", "hotpussy", "hottotrot", "hussy", "hymen", "hymie", "iblowu", "idiot", "ikey", "interracial", "intheass", "inthebuff", "islam", "israel", "israeli", "israel's", "italiano", "jackass", "jackoff", "jackshit", "jacktheripper", "jade", "japcrap", "jebus", "jeez", "jerkoff", "jiga", "jigg", "jigga", "jiggabo", "jigger ", "jiggy", "jihad", "jijjiboo", "jimfish", "jism", "jiz ", "jizim", "jizjuice", "jizm ", "jizzim", "jizzum", "juggalo", "junglebunny", "kaffer", "kaffir", "kaffre", "kafir", "kanake", "kigger", "killed", "killing", "kills", "kink", "kissass", "kkk", "knockers", "kock", "kondum", "koon", "kotex", "krap", "krappy", "kraut", "kum", "kumbubble", "kumbullbe", "kummer", "kumming", "kumquat", "kums", "kunilingus", "kunnilingus", "kunt", "ky", "kyke", "lapdance", "lap dance", "lesbain", "lesbayn", "lesbian", "lesbin", "lesbo", "lez", "lezbe", "lezbefriends", "lezbo", "lezz", "lezzo", "libido", "licker", "lickme", "limey", "limpdick", "limy", "live sex", "loadedgun", "lovebone", "lovegoo", "lovegun", "lovejuice", "lovemuscle", "lovepistol", "loverocket", "lowlife", "lsd", "lubejob", "lucifer", "luckycammeltoe", "lugan", "lynch", "macaca", "mafia", "mams", "manhater", "manpaste", "marijuana", "mastabate", "mastabater", "masterbate", "masterblaster", "mastrabator", "mattressprincess", "meatbeatter", "meatrack", "meth", "mgger", "mggor", "mickeyfinn", "mideast", "minority", "mockey", "mockie", "mocky", "mofo", "moky", "molest", "molester", "molestor", "moneyshot", "mooncricket", "mormon", "moron", "moslem", "mosshead", "mothafuck", "mothafucka", "mothafuckaz", "mothafucked ", "mothafucker", "mothafuckin", "mothafucking ", "mothafuckings", "motherfuck", "motherfucked", "motherfuckin", "motherfucking", "motherfuckings", "motherlovebone", "muff", "muffdive", "muffdiver", "muffindiver", "mufflikcer", "mulatto", "muncher", "munt", "murder", "murderer", "muslim", "naked", "narcotic", "nasty", "nastybitch", "nastyho", "nastyslut", "nastywhore", "nazi", "necro", "negroes", "negroid", "negro's", "nig", "niger", "nigerian", "nigerians", "nigg", "niggah", "niggaracci", "niggard", "niggarded", "niggarding", "niggardliness", "niggardliness's", "niggardly", "niggards", "niggard's", "niggaz", "niggerhead", "niggerhole", "niggers", "nigger's", "niggle", "niggled", "niggles", "niggling", "nigglings", "niggor", "niggur", "niglet", "nignog", "nigr", "nigra", "nigre", "nip", "nipplering", "nittit", "nlgger", "nlggor", "nofuckingway", "nook", "nookey", "nookie", "noonan", "nooner", "nudger", "nuke", "nutfucker", "nymph", "ontherag", "orga", "orgasim ", "orgies", "osama", "palesimian", "palestinian", "pansies", "pansy", "payo", "peck", "pecker", "peckerwood", "pee", "peehole", "pee-pee", "peepshow", "peepshpw", "pendy", "penetration", "peni5", "penile", "penises", "perv", "phonesex", "phuk", "phuked", "phuking", "phukked", "phukking", "phungky", "phuq", "pi55", "picaninny", "piccaninny", "pickaninny", "piker", "piky", "pimp", "pimped", "pimper", "pimpjuic", "pimpjuice", "pimpsimp", "pindick", "piss", "pissed", "pisser", "pisses ", "pisshead", "pissin ", "pissoff ", "pistol", "pixie", "pixy", "playgirl", "pocha", "pocho", "pocketpool", "pohm", "polack", "pom", "pommie", "pommy", "poo", "poop", "pooper", "pooperscooper", "pooping", "poorwhitetrash", "popimp", "porchmonkey", "pornflick", "pornking", "pornprincess", "pric", "prickhead", "primetime", "propaganda", "prostitute", "protestant", "pu55i", "pu55y", "pube", "pubic", "pubiclice", "pud", "pudboy", "pudd", "puddboy", "puke", "puntang", "purinapricness", "puss", "pussie", "pussies", "pussycat", "pussyeater", "pussyfucker", "pussylicker", "pussylips", "pussylover", "pussypounder", "pusy", "quashie", "queer", "quickie", "ra8s", "rabbi", "racial", "racist", "radical", "radicals", "randy", "raped", "raper", "rearend", "rearentry", "redlight", "redneck", "reefer", "reestie", "refugee", "rentafuck", "republican", "rere", "retard", "retarded", "ribbed", "rigger", "roach", "roundeye", "rump", "russki", "russkie", "sadis", "sadom", "samckdaddy", "sandm", "sandnigger", "satan", "scag", "scallywag", "screwyou", "scum", "seppo", "sexed", "sexfarm", "sexhound", "sexhouse", "sexing", "sexkitten", "sexpot", "sexslave", "sextogo", "sextoy", "sextoys", "sexwhore", "sexymoma", "sexy-slim", "shag", "shaggin", "shagging", "shat", "shav", "shawtypimp", "sheeney", "shhit", "shinola", "shitcan", "shitdick", "shite", "shiteater", "shited", "shitface", "shitfaced", "shitfit", "shitforbrains", "shitfuck", "shitfucker", "shitfull", "shithapens", "shithappens", "shithead", "shithouse", "shiting", "shitlist", "shitola", "shitoutofluck", "shits", "shitstain", "shitted", "shitter", "shitting", "shortfuck", "sissy", "sixsixsix", "sixtynine", "sixtyniner", "skank", "skankbitch", "skankfuck", "skankwhore", "skanky", "skankybitch", "skankywhore", "skinflute", "skum", "skumbag", "slant", "slapper", "slaughter", "slav", "slave", "slavedriver", "sleezebag", "sleezeball", "slideitin", "slimeball", "slimebucket", "slopehead", "slopey", "slopy", "sluts", "slutt", "slutting", "slutty", "slutwear", "slutwhore", "smack", "smackthemonkey", "snatchpatch", "snigger", "sniggered", "sniggering", "sniggers", "snigger's", "sniper", "snot", "snowback", "snownigger", "sob", "sodom", "sodomise", "sodomite", "sonofabitch", "son of a bitch", "sonofbitch", "son of bitch", "sooty", "sos", "soviet", "spaghettibender", "spaghettinigger", "spank", "spankthemonkey", "spermacide", "spermbag", "spermhearder", "spermherder", "spick", "spig", "spigotty", "spitter", "splittail", "spreadeagle", "spunky", "squaw", "stagg", "stiffy", "stringer", "stripclub", "stroking", "stupid", "stupidfuck", "stupidfucker", "suckdick", "sucker", "suckme", "suckmyass", "suckmydick", "suckmytit", "suckoff", "suicide", "swallower", "swalow", "taboo", "taff", "tampon", "tang", "tarbaby", "tard", "teat", "terror", "terrorist", "teste", "thicklips", "thirdeye", "thirdleg", "threeway", "timbernigger", "tinkle", "titbitnipply", "titfuck", "titfucker", "titfuckin", "titjob", "titlicker", "titlover", "tittie", "tnt", "tongethruster", "tonguethrust", "tonguetramp", "tortur", "torture", "trailertrash", "tramp", "trannie", "transexual", "transsexual", "transvestite", "triplex", "trisexual", "trojan", "trots", "tuckahoe", "tunneloflove", "turd", "turnon", "twobitwhore", "uck", "uk", "unfuckable", "uptheass", "upthebutt", "urinate", "usama", "vatican", "vibr", "vibrater", "vietcong", "virginbreaker", "wab", "wanker", "wanking", "waysted", "weapon", "weenie", "weewee", "welcher", "wetb", "wetspot", "whacker", "whash", "whigger", "whiskeydick", "whiskydick", "whitenigger", "whitetrash", "whitey", "whiz", "whop", "whorefucker", "whorehouse", "wigger", "willie", "williewanker", "willy", "wn", "wog", "wop", "wtf", "wuss", "wuzzie", "xtc", "yankee", "yellowman", "zigabo", "zipperhead", "Badir", "Badirchand", "Bakland", "Bhandava", "bhadwa", "bhoot", "Bhootnee", "bhootni", "Chinaal", "Chup Kar", "Shut Up", "Chutia", "Chutiya", "choo tia", "chootia", "Chutan", "Ghasti", "gashti", "gasti", "ghassad", "Haraami", "harami", "Haraam Zaada", "Hijda / Hijra", "Jaan var", "Kutta", "Kuttiya", "Khota", "Khotey ki aulad", "Kutte ki jat", "Najayaz", "Najayaz paidaish", "Saala kutta", "Saali kutti", "Soover", "Tatti", "Bahen Chod", "Bahen ke laude", "Bahen ke takke", "Beti Chod", "Bhai Chod", "Bhains ki aulad", "Jhalla, Faggot", "Jhant ke baal", "Jhaant ke pissu", "Kutte ka aulad", "Kutte ke tatte", "Maadher chod", "Padma", "Raand ka jamai", "Randhwa", "randwa", "Rundi", "randi", "Rundi ka bacha", "Rundi Ki bachi", "Soower ke bachche", "suwar", "soowar", "Ullu ke pathe", "Bandaa", "Booblay", "Bhonsri", "bhosdi", "Carrom board", "Chhed", "Chut", "Chut marike", "Chodu", "Chodra", "Choochii", "Gaandu", "gandu", "Gaand", "LavDa", "Lavde", "Lund", "Lavde ke bal", "Lavander", "Mangachinamun", "Muth mar", "Nimbu sharbat", "Maa ke bable", "Mammey", "mamme", "Tatte", "tattey", "Toto", "Toota hua lund", "Lund choosu", "Lund fakeer", "Lundoos", "Lund ka shorba", "Land ka bheja", "Lund pe chad ja", "Lund pe thand hai", "Lund Ke Pasine", "Maa ke bhadwe", "Muth maar", "Parichod", "Phatele Nirodh ke Natije", "nirodh", "Pucchi", "Raandi baajer", "Rundi ko choud", "Rubber bhosda", "Sadi hui gand", "Tera adha Nirodh mein rah gaya", "Apna land choos", "Apni gaand mein muthi daal", "Apni ma ko ja choos", "muth", "Gandkate", "Jaa Apni Bajaa", "Jhaat", "Kutte", "choot", "Lund Chus", "Ma chudi", "chodoonga", "suhaag", "raat", "suhaag raat", "Raand", "behen", "lauda", "loda", "chodunga", "teri gand", "gand", "kutti", "kutiya", "tutu", "kutia"];
$(function() {});
$(document).on("keyup", "[data-validator='badwordchecker']", function() {
    var t = $(this).val()
      , n = $(this).parent().find('[data-attr="error-message"]');
    hasBadWord(t) ? n.html("<i class='fas fa-exclamation-triangle'><\/i>Please remove bad words / offensive language.") : n.text("")
});
if (isDesktop = !0,
(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) && (isDesktop = !1),
!isDesktop) {
    $(window).scroll(function() {
        $(this).scrollTop() > 1 ? $(".searchComboBlock").addClass("fixedTop") : $(".searchComboBlock ").removeClass("fixedTop")
    });
    $(".searchAuto").on("focus", function() {
        $(".searchComboBlock").addClass("fullHeight");
        $("html, body").scrollTop(0)
    });
    $(".backPage").on("click", function() {
        $(".mainSearchBlock").is(":visible") ? $(".searchComboBlock").removeClass("fullHeight") : $(".localitySearchBlock").is(":visible") && ($(".localitySearchBlock").hide(),
        $(".mainSearchBlock").show())
    });
    $(".showLocationSearchBlock").click(function() {
        $(".localitySearchBlock").show();
        $(".mainSearchBlock").hide()
    });
    $(".searchComboBlock .detectedLocation .localityText").click(function() {
        $(".localitySearchBlock").show();
        $(".mainSearchBlock").hide()
    });
    $(".searchComboBlock .mainSearchBlock .inputSearchbox").addClass("animated");
    setTimeout(function() {
        $(".searchComboBlock .mainSearchBlock .inputSearchbox").removeClass("animated")
    }, 4e3)
}
$(document).on("click", "[data-id='closeBtn']", function() {
    $("#venderNotification").hide();
    setLocalStorageItem("lastCloseTime", Date.now().toString())
});
$(function() {
    var n = getLocalStorageItem("lastCloseTime"), t;
    n ? (t = Date.now() - parseInt(n),
    t < 36e5 ? $("#venderNotification").hide() : $("#venderNotification").show()) : $("#venderNotification").show();
    $(document).on("init", ".googleAds", function() {});
    $(".listYourBusinessBannerBlock").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: !1,
        dots: !1,
        fade: !0,
        autoplay: !0,
        autoplaySpeed: 3e3,
        speed: 500,
        infinite: !0,
        variableWidth: !1,
        pauseOnHover: !1,
        pauseOnFocus: !1
    });
    const i = document.getElementById("inputs");
    i.addEventListener("input", function(n) {
        const t = n.target
          , i = t.value;
        if (isNaN(i)) {
            t.value = "";
            return
        }
        if (i != "") {
            const n = t.nextElementSibling;
            n && n.focus()
        }
    });
    i.addEventListener("keyup", function(n) {
        const t = n.target
          , i = n.key.toLowerCase();
        if (i == "backspace" || i == "delete") {
            t.value = "";
            const n = t.previousElementSibling;
            n && n.focus();
            return
        }
    });
    $("body").on("click", function(n) {
        ['[data-attr="locationSearchbox"]', '[data-attr="gblSearchbox"]', '[data-attr="detectLocation"]'].some(t => $(n.target).closest(t).length) || ($('[data-attr="inputLocalitySearchBlock"]').hide(),
        $('[data-attr="gblsuggestionbox"]').hide())
    });
    (new WOW).init();
    $(".globalRightSticky").addClass("toggleSticky");
    $(".globalRightToggle").click(function() {
        $(".globalRightSticky").toggleClass("toggleSticky");
        $(this).html(function(n, t) {
            return t == '<i class="fas fa-angle-double-left"><\/i>' ? '<i class="fas fa-angle-double-right"><\/i>' : '<i class="fas fa-angle-double-left"><\/i>'
        })
    });
    $(".advertiseWidthUs").click(function() {
        $("html, body").animate({
            scrollTop: $("#advertiseWithUs").offset().top - 30
        }, 100)
    });
    const r = new Audio("https://assets.indiaonline.in/common/sound.mp3");
    $('[data-voicesearch="voiceSearchButton"]').click( () => r.play())
});
rootUrl = "";
timerDuration = 60;
$(function() {
    function f(n) {
        var t = 0
          , i = setInterval(function() {
            $("#userspeechtext").text(n.substring(0, t));
            t++;
            t > n.length && (clearInterval(i),
            listeningModal.modal("hide"),
            $("#userspeechtext").text(""))
        }, 1)
    }
    var r, t, n, i, e;
    rootUrl = window.location.protocol + "//" + window.location.host;
    $("#offcanvasCatagaries").on("show.bs.offcanvas", function() {
        showloader();
        $.ajax({
            url: rootUrl + "/iolajax/ajax/getmaincategorymappingcate",
            method: "GET",
            dataType: "html",
            success: function(n) {
                $('[data-cat-dv-id="Dvheadercategories"]').html(n);
                $("ul.subCategory").each(function() {
                    $(this).find("li").length > 3 && $(this).find("li:nth-child(3)").after('<li><button type="button"><i class="fas fa-ellipsis-h"><\/i><\/button><\/li>')
                });
                $("#offcanvasCatagaries .subCategory button").on("click", function() {
                    $(this).parents("li.nav-item").addClass("active")
                });
                $("#offcanvasCatagaries .categoryItem button").on("click", function() {
                    $(this).parents("li.nav-item").removeClass("active")
                })
            },
            error: function(n) {
                Hideloader();
                console.error("Error loading partial view:", n)
            }
        })
    });
    $('[data-search-box-name="gblsearch"]').on("keydown", function(n) {
        n.key === "Enter" && $(this).parents('[data-attr="gblSearchbox"]').find('[data-attr="btnsearch"]').trigger("click")
    });
    $(document).on("click", "ul[data-attr='suggetsedlocation'] li", function() {
        isDesktop || $(".backPage").trigger("click");
        var u = $(this).attr("data-cityname")
          , f = $(this).attr("data-cityid")
          , n = $(this).attr("data-complete-loc")
          , e = $(this).attr("data-domain")
          , o = $(this).attr("data-searchtype")
          , t = $(this).attr("data-lat")
          , i = $(this).attr("data-long")
          , s = $(this).attr("data-url")
          , h = $(this).attr("data-id")
          , r = !1;
        o == 9 && (r = !0);
        $('[data-loc="usrloc_mob"]').text(n);
        $('[data-loc-id="usrloc"]').val(n);
        $('[data-search-box-name="gblsearch"]').attr("placeholder", "Search in " + n);
        setVisitorlocationLocalStorage(f, u, n, e, s, t, i, r, h);
        setlocationListBylatlong(parstLatlongformat(t), parstLatlongformat(i));
        $('[data-search-box-name="gblsearch"]').focus();
        $('[data-attr="gblSearchbox"]').trigger("click")
    });
    r = $("#locsearchloader");
    $('[data-loc-id="usrloc"]').autocomplete({
        source: function(n) {
            $('[data-attr="inputLocalitySearchBlock"]').show();
            r.show();
            $.ajax({
                url: rootUrl + "/iolajax/ajax/searchlocationsuggestion",
                type: "GET",
                dataType: "json",
                data: {
                    term: n.term,
                    ctid: getLocalStorageItem("ud_cid")
                },
                success: function(n) {
                    var t = "";
                    $('[data-attr="suggetsedlocation"]').empty();
                    n.length > 0 && n.forEach(function(n) {
                        t = '<li class="defaultLocationIcon" data-id="' + n.searchId + '" data-searchtype="' + n.searchType + '" data-cityid="' + n.cityid + '" data-lat="' + n.latitude + '" data-long="' + n.longitude + '" data-cityname="' + n.cityName + '" data-domain="' + n.cityDomain + '" data-url="' + n.url + '" data-complete-loc="' + n.displayName + '"><span>' + n.displayName + "<\/span><\/li>";
                        $('[data-attr="suggetsedlocation"]').append(t)
                    });
                    r.hide()
                }
            })
        },
        minLength: 1
    });
    $('[data-search-box-name="gblsearch"]').autocomplete({
        source: function(n) {
            $('[data-id="globalsearchloader"]').show();
            var t = $(this.element)
              , i = localStorage.getItem("ud_lat")
              , r = localStorage.getItem("ud_long");
            setLocalStorageItem("usrchterm", n.term);
            $.ajax({
                url: rootUrl + "/iolajax/ajax/globalsitesearch",
                type: "GET",
                dataType: "json",
                data: {
                    term: n.term.replace(/near me/i, ""),
                    targetlatitude: parstLatlongformat(i),
                    targetlongitude: parstLatlongformat(r)
                },
                success: function(n) {
                    var i = t.data("target");
                    n.length > 0 ? (bindSearchList(n, i),
                    setLocalStorageItem("urecentsearch", n),
                    $('[data-id="globalsearchloader"]').hide()) : ($('[data-id="globalsearchloader"]').hide(),
                    $('[data-target="' + i + '"]').parents('[data-attr="gblSearchbox"]').next().find('[data-attr="suggetsedsearchlist"]').empty(),
                    $('[data-target="' + i + '"]').parents('[data-attr="gblSearchbox"]').next('[data-attr="gblsuggestionbox"]').hide())
                }
            })
        },
        change: function() {},
        minLength: 1
    }).keyup(function() {
        var n = $(this).val();
        n.length > 0 ? $('[data-id="clearsearchterm"]').show() : $('[data-id="clearsearchterm"]').hide();
        n.toLowerCase().includes("near me") && $("[data-attr='detectLocation']").trigger("click")
    });
    $(document).on("click", "ul[data-attr='suggetsedsearchlist'] li", function() {
        var t = $(this).attr("data-url")
          , i = $(this).attr("data-refid")
          , r = $(this).attr("data-searchtype")
          , r = $(this).attr("data-searchtype")
          , u = $(this).attr("data-id")
          , n = $(this).parent().parent().parent().find("input").val();
        setLocalStorageItem("usrchterm", n);
        SearchRedirection(t, i, r);
        n !== "" && searchlog(n, u)
    });
    let u = "";
    $('[data-loc-id="usrloc"]').on({
        focus: function() {
            u = $(this).val();
            getLocalStorageItem("ud_loc") !== null && getLocalStorageItem("ud_loc") !== undefined && (u = getLocalStorageItem("ud_loc"));
            $(this).val("")
        },
        blur: function() {
            $(this).val() === "" && $(this).val(u)
        }
    });
    t = new webkitSpeechRecognition;
    listeningModal = $("#listeningModal");
    n = $('[data-search-box-name="gblsearch"]');
    t.onstart = function() {
        listeningModal.modal("show");
        $("#didentget").hide();
        $("#listning").hide();
        setTimeout( () => {
            $("#speechmsg").hide(),
            $("#didentget").hide(),
            $("#listning").show()
        }
        , "1")
    }
    ;
    t.onresult = function(t) {
        var i = t.results[0][0].transcript;
        localStorage.removeItem("urecentsearch");
        $('[data-attr="suggetsedsearchlist"]').empty();
        setLocalStorageItem("usrchterm", i);
        i.toLowerCase().includes("near me") ? ($("[data-attr='detectLocation']").trigger("click"),
        navigator.geolocation.getCurrentPosition(function() {
            f(i);
            n.val(i);
            n.autocomplete("search", i);
            setTimeout( () => {
                var t = $.Event("keydown", {
                    key: "Enter"
                });
                n.trigger(t)
            }
            , "2000")
        }, function() {
            return f(i),
            n.val(i),
            n.autocomplete("search", i),
            listeningModal.modal("hide"),
            !1
        })) : (f(i),
        n.val(i),
        n.autocomplete("search", i),
        setTimeout( () => {
            var t = $.Event("keydown", {
                key: "Enter"
            });
            n.trigger(t)
        }
        , "2000"))
    }
    ;
    t.onerror = function(n) {
        $("#listning").hide();
        $("#speechmsg").hide();
        $("#didentget").show();
        setTimeout( () => {
            listeningModal.modal("hide"),
            $("#userspeechtext").text("")
        }
        , "1");
        console.error("Speech recognition error:", n.error)
    }
    ;
    t.onend = function() {
        listeningModal.modal("hide");
        $("#userspeechtext").text("")
    }
    ;
    $('[data-voicesearch="voiceSearchButton"]').on("click", function() {
        n = $(this).parent('[data-attr="gblSearchbox"]').find("input");
        $("#userspeechtext").text("");
        $("#speechmsg").show();
        t.start()
    });
    $("#listeningModal").on("hidden.bs.modal", function() {
        t.abort()
    });
    $('[data-id="mainMobileNumber"]').on("input", function() {
        var t, n, i;
        /^[5-9][0-9]*$/.test($(this).val()) || $(this).val("");
        t = $(this).val().replace(/[^0-9]/g, "");
        $(this).val(t);
        n = $(this).val();
        n.length == 10 && ValidMobileNumber(n) && (i = isMobileNumberExists(n))
    });
    $('[data-id="userMobileNumber"]').on("keyup", function() {
        var n;
        /^[5-9][0-9]*$/.test($(this).val()) || $(this).val("");
        n = $(this).val().replace(/[^0-9]/g, "");
        $(this).val(n)
    });
    i = document.getElementById("verifyboxsOTP");
    e = document.getElementById("notp0");
    i.addEventListener("show.bs.modal", function() {
        $("#waitingLoader").modal("hide")
    });
    i.addEventListener("shown.bs.modal", function() {
        e.focus();
        startTimer()
    });
    i.addEventListener("hidden.bs.modal", function() {
        $("#hdnotpformreferalaction").val(0)
    });
    $(".otp-input").on("keydown", function(n) {
        if (n.keyCode === 38 || n.keyCode === 40)
            return n.preventDefault(),
            !1
    });
    $("#loginRegister").on("hide.bs.modal", function() {
        HideProgressLoader("[data-id='sendOtpBtn']", "Login with OTP");
        var n = $("#idcurrentcitystatename").val()
          , t = "Gain complete access & connect with thousands of verified businesses in <span class='colorPrimary'>" + n + "<\/span>";
        setTimeout(function() {
            $('[data-attr="loginheadermsg"]').html(t)
        }, 500)
    });
    $("#loginRegister").on("show.bs.modal", function() {
        getLocalStorageItem("mobile") !== null && getLocalStorageItem("mobile") !== undefined && $('[data-id="mainMobileNumber"]').val(getLocalStorageItem("mobile"));
        getLocalStorageItem("username") !== null && getLocalStorageItem("username") !== undefined && $('[data-id="username"]').val(getLocalStorageItem("username"));
        $('[data-attr="resendattempt"]').val(1);
        setLocalStorageItem("askedlogin", 1);
        window.location.href.indexOf("grow-your-business") === -1 && (localStorage.removeItem("referral"),
        localStorage.removeItem("pid"),
        localStorage.removeItem("ptype"))
    });
    $('[data-id="clearsearchterm"]').on("click", function() {
        localStorage.removeItem("usrchterm");
        $('[data-search-box-name="gblsearch"]').val("");
        $('[data-id="clearsearchterm"]').hide();
        $('[data-search-box-name="gblsearch"]').focus()
    });
    $('[data-id="username"], [data-id="personName"]').on("keyup", function() {
        var n = $(this).val();
        /^[a-zA-Z0-9\s]*$/.test(n) || $(this).val(n.replace(/[^a-zA-Z0-9\s]/g, ""))
    })
});
$('[data-attr="loginchecker"]').on("click", function() {
    var r = readcookie("userid"), o = $(this).data("referral"), u = $(this).data("pid"), i = $(this).data("ptype"), f, e;
    if (r === null || r === undefined)
        f = $(this).data("login-msg"),
        $('[data-attr="loginheadermsg"]').text(f),
        setLocalStorageItem("referral", "growyourbusiness"),
        setLocalStorageItem("pid", u),
        setLocalStorageItem("ptype", i),
        $("#loginRegister").modal("show");
    else if (o === "growyourbusiness") {
        $("#takingyoutoredirectionLoader").modal("show");
        e = $("#idcurrentdomain").val();
        setLocalStorageItem("pid", u);
        setLocalStorageItem("ptype", i);
        var n = "list-your-business"
          , t = $('[data-id="hdnredirectdomain"]').val()
          , s = getLocalStorageItem("mobile");
        $.ajax({
            url: rootUrl + "/iolajax/ajax/getselectedplaninfo",
            type: "GET",
            contentType: "application/json",
            data: {
                mobile: s,
                ptype: i
            },
            success: function(i) {
                var r, u, f;
                typeof i.redirect != "undefined" && i.redirect === !0 ? ($('[data-id="imageloaderDefault"]').show(),
                i.url !== undefined && i.url !== null && (t = i.url,
                r = i.isActive,
                n = r ? "my-listing" : "list-your-business"),
                e != t ? (u = "https://" + t + "/" + n,
                f = infoutkn(u)) : window.location.href = "https://" + t + "/" + n) : ($("#takingyoutoredirectionLoader").modal("hide"),
                $('[data-attr="growpagecartsummery"]').empty(),
                $('[data-attr="growpagecartsummery"]').append(i),
                $("#cartPopup").modal("show"))
            }
        })
    }
});
$('[data-attr="locationSearchbox"]').on("click", function() {
    if (getLocalStorageItem("uloclist") !== null && getLocalStorageItem("uloclist") !== undefined) {
        var n = getLocalStorageItem("uloclist");
        n && bindLocationList(n)
    }
    $('[data-attr="inputLocalitySearchBlock"]').show();
    $('[data-attr="gblsuggestionbox"]').hide();
    $('[data-loc-id="usrloc"]').focus()
});
$('[data-attr="gblSearchbox"]').on("click", function() {
    var i = $(this.element), n, t;
    getLocalStorageItem("usrchterm") !== null && getLocalStorageItem("usrchterm") !== undefined && $(this).find('[data-search-box-name="gblsearch"]').val(getLocalStorageItem("usrchterm"));
    getLocalStorageItem("urecentsearch") !== null && getLocalStorageItem("urecentsearch") !== undefined ? (n = getLocalStorageItem("urecentsearch"),
    n && (t = $(this).find('[data-search-box-name="gblsearch"]').data("target"),
    bindSearchList(n, t))) : $(this).next().find('[data-attr="suggetsedsearchlist"] li').length > 0 && $(this).next('[data-attr="gblsuggestionbox"]').show();
    $('[data-attr="inputLocalitySearchBlock"]').hide()
});
$("[data-attr='btnsearch']").on("click", function() {
    var t = $(this).parent('[data-attr="gblSearchbox"]').find("input").val(), n;
    if (setLocalStorageItem("usrchterm", t),
    t === "")
        return alert("Please type what you are looking for"),
        $('[data-search-box-name="gblsearch"]').val(""),
        $('[data-search-box-name="gblsearch"]').focus(),
        $('[data-attr="gblSearchbox"]').trigger("click"),
        !1;
    if (n = $(this).parents('[data-attr="gblSearchbox"]').next('[data-attr="gblsuggestionbox"]').find('[data-attr="suggetsedsearchlist"] li:first-child'),
    typeof n == "undefined" | n.length === 0)
        return searchlog(t, 0),
        !1;
    var i = n.data("url")
      , r = n.data("refid")
      , u = n.data("searchtype")
      , u = n.data("searchtype")
      , f = n.data("id");
    SearchRedirection(i, r, u);
    searchlog(t, f)
});
luid = readcookie("userid");
isDesktop || (luid === null || luid === undefined) && "OTPCredential"in window && window.addEventListener("DOMContentLoaded", () => {
    const n = document.querySelector('input[autocomplete="one-time-code"]');
    if (n) {
        const i = new AbortController
          , t = n.closest("form");
        t && t.addEventListener("submit", () => {
            i.abort()
        }
        );
        navigator.credentials.get({
            otp: {
                transport: ["sms"]
            },
            signal: i.signal
        }).then(i => {
            n.value = i.code;
            const r = i.code;
            for (let n = 0; n < r.length && n < 4; n++)
                $('[data-id="otp' + (n + 1) + '"]').val(r[n]);
            t && $('[data-id="verifyOtpBtn"]').trigger("click")
        }
        ).catch(n => {
            console.log(n)
        }
        )
    }
}
);
document.addEventListener("DOMContentLoaded", () => {
    var n = readcookie("userid"), o = readcookie("username"), s = readcookie("mobile"), u, f, r, e;
    if (n !== null && n !== undefined && CreateUserStorage(s, o),
    u = $("#islisitngPage").val(),
    f = $("#islocality").val(),
    n === null || n === undefined ? (getLocalStorageItem("mobile") !== null && getLocalStorageItem("mobile") !== undefined && $('[data-id="userMobileNumber"]').val(getLocalStorageItem("mobile")),
    getLocalStorageItem("username") !== null && getLocalStorageItem("username") !== undefined && ($('[data-id="personName"]').val(getLocalStorageItem("username")),
    $('[data-attr="enqusrname"]').text("Hi " + getLocalStorageItem("username") + ", "),
    $(".formFieldBlock:last-child").show())) : $(".formFieldBlock:last-child").show(),
    u !== undefined)
        return f !== undefined ? (r = $("#plat").val(),
        e = $("#plong").val(),
        r !== "" ? setnearbylocationautodetection(parstLatlongformat(r), parstLatlongformat(e)) : Setdefaultlocationbydomain(!1)) : Setdefaultlocationbydomain(!1),
        getLocalStorageItem("usrchterm") !== null && getLocalStorageItem("usrchterm") !== undefined && ($('[data-search-box-name="gblsearch"]').val(getLocalStorageItem("usrchterm")),
        $('[data-search-box-name="gblsearch"]').val().length > 0 && $('[data-id="clearsearchterm"]').show()),
        !1;
    let t = localStorage.getItem("ud_lat")
      , i = localStorage.getItem("ud_long");
    if ((t === null || t === "") && (t = !1),
    (i === null || i === "") && (i = !1),
    getLocalStorageItem("usrchterm") !== null && getLocalStorageItem("usrchterm") !== undefined && ($('[data-search-box-name="gblsearch"]').val(getLocalStorageItem("usrchterm")),
    $('[data-search-box-name="gblsearch"]').val().length > 0 && $('[data-id="clearsearchterm"]').show()),
    t && i) {
        var l = parstLatlongformat(localStorage.getItem("ud_lat"))
          , h = localStorage.getItem("ud_lat")
          , c = localStorage.getItem("ud_long");
        getLocalStorageItem("uloclist") !== null && getLocalStorageItem("uloclist") !== undefined ? GetetrieveLocationListByStorage() : setnearbylocationautodetection(parstLatlongformat(h), parstLatlongformat(c))
    } else
        getLocalStorageItem("autodetected_loc") ? getLocalStorageItem("uloclist") !== null && getLocalStorageItem("uloclist") !== undefined ? GetetrieveLocationListByStorage() : getLocation() : getLocalStorageItem("uloclist") !== null && getLocalStorageItem("uloclist") !== undefined ? GetetrieveLocationListByStorage() : Setdefaultlocationbydomain()
}
);
$("[data-attr='detectLocation']").on("click", function() {
    $('[data-attr="detectLocationbtntext"]').text("Detecting...");
    $("#pushdetectmyloc").val(!0);
    manulDetectLocation()
});
$("#locationDetectionError").on("hidden.bs.modal", function() {
    $('[data-attr="locationSearchbox"]').trigger("click")
});
$("input").on("keyup", function() {
    var n = $(this).attr("data-id");
    $('[data-valmsg-for="' + n + '"]').html("")
});
$(document).on("keyup keypress blur change", "input.form-control[type='text']", function() {
    var n = $(this).val();
    n = n.replace(/(\s\s+)|([^a-zA-Z0-9\s]{2,})/g, " ");
    $(this).val(n)
});
$("[data-id='sendOtpBtn']").on("click", function(n) {
    n.preventDefault();
    var t = ValidateBadWord();
    if (t === !1)
        return !1;
    isValidMobile($('[data-id="mainMobileNumber"]'), $('[data-err="mob"]')) && isValidName($('[data-id="username"]'), $('[data-err="uname"]')) && (ShowProgressLoader(this, "Processing"),
    SendOtp($('[data-id="mainMobileNumber"]').val(), $('[data-id="username"]').val(), "Enter 4-digit OTP sent on " + $('[data-id="mainMobileNumber"]').val()))
});
$("[data-id='verifyOtpBtn']").on("click", function(n) {
    var i, u, f, t;
    n.preventDefault();
    var e = $('[data-id="otp1"]').val()
      , o = $('[data-id="otp2"]').val()
      , s = $('[data-id="otp3"]').val()
      , h = $('[data-id="otp4"]').val()
      , r = e + o + s + h
      , c = parseInt(r, 10)
      , l = !0;
    $(".otp-input").each(function() {
        if ($(this).val() === "")
            return l = !1,
            $('[data-id="otplablerr"]').text("Invalid OTP"),
            !1
    });
    i = parseInt($("#hdnotpformreferalaction").val());
    (i === null || i === undefined) && (i = 0);
    isNaN(c) || (u = $(this).data("vmob"),
    ShowProgressLoader(this, "Verifying"),
    i === 1 ? isValidOtp(r, u, commonenquirythankyou, "#enquiryThankyou") : i === 5 ? isValidOtp(r, u, "profileenquirythankyou", t) : i === 2 ? (f = getLocalStorageItem("tpb"),
    t = "",
    $.each(f, function(n, i) {
        n == 0 && (t = i)
    }),
    isValidOtp(r, u, "businessEnquiryThankyou", t)) : i === 3 ? (f = getLocalStorageItem("tpb"),
    t = "",
    $.each(f, function(n, i) {
        n == 0 && (t = i)
    }),
    isValidOtp(r, u, "viewnumber", t)) : i === 4 ? (f = getLocalStorageItem("tpb"),
    t = "",
    $.each(f, function(n, i) {
        n == 0 && (t = i)
    }),
    isValidOtp(r, u, "chatwithowner", t)) : i === 10 ? isValidOtp(r, u, "postreview", t) : isValidOtp(r, u))
});
$('input[type="text"]').on("input", function() {
    var n = $(this).attr("maxlength");
    n && $(this).val().length > n && $(this).val($(this).val().slice(0, n))
});
$('[data-id="editusername"]').on("keyup", function() {
    var n = $(this).attr("data-id");
    $('[data-valmsg-for="' + n + '"]').html("")
});
$(".otp-input").on("keyup", function(n) {
    var t;
    $('[data-id="otplablerr"]').text("");
    var r = $(this).attr("maxlength")
      , u = $(this).val().length
      , i = $(this).next(".otp-input");
    if (u === r && $(this).next(".otp-input").focus(),
    t = !0,
    $(".otp-input").each(function() {
        $(this).val() === "" && (t = !1)
    }),
    n.which === 13)
        if ($(this).is(":last-child"))
            if (t)
                $('[data-id="verifyOtpBtn"]').trigger("click");
            else
                return $('[data-id="otplablerr"]').text("Invalid OTP"),
                !1;
        else
            $(this).next(".otp-input").focus(),
            i.length > 0 && i.focus();
    t && $('[data-id="verifyOtpBtn"]').trigger("click")
});
$("[data-id='resendOtpBtn']").on("click", function() {
    var n, t, i;
    getLocalStorageItem("mobile") !== null && getLocalStorageItem("mobile") !== undefined && getLocalStorageItem("username") !== null && getLocalStorageItem("username") !== undefined && (n = getLocalStorageItem("mobile"),
    t = getLocalStorageItem("username"),
    $("[data-id='resendOtpBtn']").prop("disabled", !0),
    SendOtp(n, t, "", !0),
    $(".otp-input").val(""),
    $("#notp0").focus(),
    resetTimer(),
    i = $('[data-attr="resendattempt"]').val(),
    $('[data-attr="resendattempt"]').val(parseInt(i) + 1),
    $("[data-id='otplablerr']").text("New OTP sent successfully."),
    setTimeout(function() {
        $("[data-id='otplablerr']").text("")
    }, 3e3))
});
$(document).on("click", "[data-id='updateUnameBtn']", function(n) {
    var r, i, t, u;
    if (n.preventDefault(),
    r = ValidateBadWord(),
    r === !1)
        return !1;
    i = readcookie("userid");
    isValidName($('[data-id="editusername"]'), $('[data-err="edituname"]')) && (saveUser(i),
    t = $("#editName-" + i).val(),
    t = t ? t.replace(/\s+/g, " ").trim() : "",
    u = t.charAt(0).toUpperCase(),
    $(".alphabetBlock").text(u))
});
$('[data-id="editusername"]').on("keydown", function(n) {
    n.key === "Enter" && $("[data-id='updateUnameBtn']").trigger("click")
});
$(document).on("click", "[data-id='cancelunameBtn']", function() {
    var n = readcookie("userid");
    $("[data-editbtnid='userName-" + n + "']").show();
    $("#userName-" + n).show();
    $("#editDiv-" + n).hide()
});
