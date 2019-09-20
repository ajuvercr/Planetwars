
import { IndexBuffer } from './buffer';
import { Shader, Uniform1i, Uniform } from './shader';
import { VertexArray } from './vertexBufferLayout';
import { Texture } from './texture';
import { Dictionary } from './util';

export interface Renderable {
    render(gl: WebGLRenderingContext): void;
}

class RenderShit implements Renderable {
    ibo: IndexBuffer;
    va: VertexArray;
    shader: Shader;
    textures: Texture[];
    uniforms: Dictionary<Uniform>;

    enabled: boolean;

    constructor(
        ibo: IndexBuffer,
        va: VertexArray,
        shader: Shader,
        textures: Texture[],
        uniforms: Dictionary<Uniform>,
    ) {
        this.enabled = true;
        this.ibo = ibo;
        this.va = va;
        this.shader = shader;
        this.textures = textures;
        this.uniforms = uniforms;
    }

    render(gl: WebGLRenderingContext): void {
        if (!this.enabled) {
            return;
        }

        const indexBuffer = this.ibo;
        const vertexArray = this.va;
        const uniforms = this.uniforms;

        const shader = this.shader;
        const textures = this.textures;
        let texLocation = 0;

        for (let texture of textures) {

            shader.uniform(gl, texture.name, new Uniform1i(texLocation));
            texture.bind(gl, texLocation);

            texLocation ++;
            // if (texLocation > maxTextures) {
            //     console.error("Using too many textures, this is not supported yet\nUndefined behaviour!");
            // }
        }

        if (vertexArray && shader && uniforms) {
            for(let key in uniforms) {
                shader.uniform(gl, key, uniforms[key]);
            }

            vertexArray.bind(gl, shader);

            if (indexBuffer) {
                indexBuffer.bind(gl);
                gl.drawElements(gl.TRIANGLES, indexBuffer.getCount(), gl.UNSIGNED_SHORT, 0);
            } else {
                console.error("IndexBuffer is required to render, for now");
            }
        }

    }

}

export class Renderer {
    renderables: RenderShit[];

    constructor() {
        this.renderables = [];
    }

    updateUniform(i: number, f: (uniforms: Dictionary<Uniform>) => void) {
        f(this.renderables[i].uniforms);
    }

    disableRenderShift(i: number) {
        this.renderables[i].enabled = false;
    }

    enableRendershit(i: number) {
        this.renderables[i].enabled = true;
    }

    // addRenderable(item: Renderable) {
    //     this.renderables.push(item);
    // }

    addToDraw(indexBuffer: IndexBuffer, vertexArray: VertexArray, shader: Shader, uniforms?: Dictionary<Uniform>, texture?: Texture[]): number {

        this.renderables.push(
            new RenderShit(
                indexBuffer,
                vertexArray,
                shader,
                texture || [],
                uniforms || {},
            )
        );

        return this.renderables.length - 1;
    }

    render(gl: WebGLRenderingContext, frameBuffer?: WebGLFramebuffer, width?: number, height?: number) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.viewport(0, 0, width || gl.canvas.width, height || gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const maxTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);

        for (let r of this.renderables) {
            r.render(gl);
        }

    }
}
