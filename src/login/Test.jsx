import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router";
import { Username } from "../database/funcs";
import { AuthContext } from "../Auth";

export const Test = function(){


    return (
        <div className="login-bg">
    <div className="login-bar">
    
        <form >
        <img className="signuplogo2" src={process.env.PUBLIC_URL + '/myimage.png'}/>
                <div className="form-group" style={{ width: "80%", margin: "20px" }}>
                    <label for="bio">Say something about yourself {}</label>
                    <input type="text" className="form-control" name="bio" id="bio"  placeholder="Your Bio (Optional)"  />
                </div>
                <div className="form-group" style={{ width: "80%", margin: "20px"  }}>
                
                <label for="title">Which role describles you the most?</label>
                           <select className="form-control" name="title" id="title"   >
                                <option>Creator (Default)</option>
                                <option>Writer</option>
                                <option>Poet</option>
                                <option>Speaker</option>
                                <option>Singer</option>
                                <option>Content Creator</option>
                                <option>Film Maker</option>
                           </select>
                </div>
                <div className="form-group submit" style={{ width: "80%", margin: "20px"  }}>
                    <input type="submit" className="myshadow mybtn btn btn-default" id="signin" value="Save" />
                </div>
            </form>
            </div>
            </div>);
}
