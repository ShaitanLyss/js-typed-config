import { describe, it, beforeAll, afterAll, beforeEach } from "bun:test"
import { MissingConfigError, ConfigValidationError, getConfig } from "../src/index";
import assert from "assert";


describe("initializeConfig", () => {
    beforeAll(() => {
        // mock config
        process.env["NODE_CONFIG_DIR"] = import.meta.dir + "/config/";
    });
    it("should initialize the config", async () => {
        const config = await getConfig({
            domain: "successful_test_1",
            schema: {
                name: "string",
                port: "number",
                device: {
                    platform: "'android'|'ios'",
                    "version?": "number"
                }
            }
        });
        assert.strictEqual(config.name, "Alan Turing")
        assert.strictEqual(config.port, 10)
        assert.strictEqual(config.device.version, 5)
        assert.strictEqual(config.device.platform, "android");
    });

    it("should throw a config validation error if the config is invalid", async () => {
        await assert.rejects(getConfig({
                domain: "failing_test_1",
                schema: {
                    name: "string",
                    port: "number",
                    device: {
                        platform: "'android'|'ios'",
                        "version?": "number"
                    }
                }
        
        }), ConfigValidationError)
    });

    it("should throw a missing config error if the config is missing", async () => {
        const domain = 'missing_test_1'
        await assert.rejects(getConfig({
                domain: domain,
                schema: {
                    name: "string",
                    port: "number",
                    device: {
                        platform: "'android'|'ios'",
                        "version?": "number"
                    }
                }
            })
        , MissingConfigError)
    })
});
