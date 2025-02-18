import SwaggerParser from "@apidevtools/swagger-parser";
import filedirname from "filedirname";
import {unlinkSync, writeJsonSync} from "fs-extra";
import {SpecTypes} from "@tsed/schema";
import {v4} from "uuid";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();

export const validateSpec = async (spec: any, version = SpecTypes.SWAGGER) => {
  const file = `${rootDir}/spec-${v4()}.json`;
  spec = {
    ...spec
  };

  try {
    if (version === SpecTypes.OPENAPI) {
      spec.openapi = "3.0.1";
    } else {
      spec.swagger = "2.0";
    }

    spec.info = {
      title: "Title",
      description: "Description",
      termsOfService: "http://www.apache.org/",
      contact: {
        email: "apiteam@swagger.io"
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      },
      version: "1.0.0"
    };

    writeJsonSync(file, spec, {encoding: "utf8"});
    await SwaggerParser.validate(file);

    return true;
  } catch (er) {
    return er;
  } finally {
    try {
      unlinkSync(file);
    } catch (er) {}
  }
};
