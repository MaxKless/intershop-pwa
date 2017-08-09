package pages

import geb.Page

class HomePage extends StorefrontPage
{


    static url= StorefrontPage.url + "";
    
    static at =
    {
        //The homepage must get the class "homepage" in backoffice
        waitFor{$("is-home-page").size()>0}
    }

    static content =
    {
        signInLink(required:false){$("a",class:"my-account-links my-account-login")}
        catalogBar {$("ul",class:contains("navbar-nav"))}
        registerLink {$("a",class:"ish-siteHeader-myAccountUtilitiesMenu-myAccount-register")}
        logoutLink {$("a",class:"my-account-link my-account-logout")}
        
    }

    //------------------------------------------------------------
    // Page checks
    //------------------------------------------------------------

    def isSignedIn(bool)
    {
        bool == (signInLink.size()==0)
    }

    //------------------------------------------------------------
    // link functions
    //------------------------------------------------------------
    def pressLogIn()
    {
        signInLink.click()
    }

    def pressLogOut()
    {
        logoutLink.click()
    }

    def selectCatalog(channel)
    {
        waitFor{$('a[data-testing-id="'+channel+'-link"]').size()==1}
        $("a[data-testing-id='"+channel+"-link']").click()
    }

    def clickCategoryLink(categoryId) {
        waitFor{$('[data-testing-id="'+categoryId+'-link"]').size()==1}
        $('[data-testing-id="'+categoryId+'-link"]').click()
    }
}


