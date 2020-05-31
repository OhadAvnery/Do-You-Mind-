[![Build Status](https://travis-ci.com/OhadAvnery/do_you_mind.svg?branch=master)](https://travis-ci.com/OhadAvnery/do_you_mind)
[![Documentation Status](https://readthedocs.org/projects/do-you-mind/badge/?version=latest)](https://do-you-mind.readthedocs.io/en/latest/?badge=latest)
[![CodeCov](https://i.imgur.com/l7YTBgz.png)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)


# doyoumind

A package responsible for uploading user snapshots, parsing them and visualising the results. 
See [full documentation](https://do-you-mind.readthedocs.io/en/latest).

## Installation

1. Clone the repository and enter it:

    ```sh
    $ git clone https://github.com/OhadAvnery/do_you_mind.git
    ...
    $ cd do_you_mind
    ```

2. Run the installation script and activate the virtual environment (also building the docker image):

    ```sh
    $ ./scripts/install.sh
    ...
    $ source .env/bin/activate
    [doyoumind] $ # oooweeee!
    ```

3. There aren't really any tests, but if you'd like to see a green dot, run:


    ```sh
    $ pytest tests/
    ...
    ```

## Usage

The `doyoumind` package provides the following subpackages:

- `client`
    This package allows the user to stream cognition snapshots to a server.
    It provides the 'upload_sample' method, whose parameters are:
    -host, port: the server's host and port (usually '127.0.0.1',8000 respectively).
    -path: the snapshots sample file. (Either uncompressed, or compressed with .gz)
    -read_type: the type of the sample.
    this parameter is optional, and defaults to 'protobuf' (so the samples it takes have the form described in readers/doyoumind.proto). 
    protobuf is also the only format that works for now- there's also a 'binary' format, but it hasn't been fully fleshed out.

    API example-
    ```pycon
    >>> from cortex.client import upload_sample
    >>> upload_sample(host='127.0.0.1', port=8000, path='sample.mind.gz')
    … # upload path to host:port
    ```
    CLI example-
    ```sh
    $ python -m cortex.client upload-sample \
      -h/--host '127.0.0.1'             \
      -p/--port 8000                    \
      'snapshot.mind.gz'
    ```


- `server`

    This package runs a server at a given host+port, listening to multiple clients, receiving snapshots from them and sending them to various publishers.
    It provides the 'run_server' method, whose parameters are:
    -host, port: the host and port to run from (usually '127.0.0.1',8000 respectively).
    -database: the drive url for the project's database, where the server will send information about new users to. Defaults to 'mongodb://127.0.0.1:27017'. (currently only supports mongodb)
    -publish: a function that's activated on any received snapshot.
    could also be a drive URL for a message queue, for which the server publishes all snapshots.
    (currently only supports rabbitmq)
    -data: the data directory to save the snapshot's data blob's to, defaults to ./snaps.

    API example-
    ```pycon
    >>> from doyoumind.server import run_server
    >>> def print_message(message):
    ...     print(message)
    >>> run_server(host='127.0.0.1', port=8000, publish=print_message)
    … # listen on host:port and pass received messages to publish
    ```
    CLI example-
    ```sh
    $ python -m cortex.server run-server \
      -h/--host '127.0.0.1'          \
      -p/--port 8000                 \
      'rabbitmq://127.0.0.1:5672/'
    ```
- `parsers`
This package includes parser functions- mini-services that, given a snapshot's raw data, produce a parsed result of it. Each parser produces a different topic (pose, feelings, depth image and color image). For full information about each parser, read their documentation.

    **run_parser-** an API function. Accepts a parser name and some raw data, as consumed from the message queue, and returns the result, as published to the message queue. 
    example-
    ```pycon
    >>> from doyoumind.parsers import run_parser
    >>> data = … 
    >>> result = run_parser('pose', data)
    ```
    **parse-** a CLI function. Accepts a parser name and a path to some raw data, as consumed from the message queue, and prints the result, as published to the message queue (optionally redirecting it to a file).
    example-
    ```sh
    $ python -m doyoumind.parsers parse 'pose' 'snapshot.raw' > 'pose.result'
    ```

    **run-parser-** a CLI function. Runs the topic's parser as a service, which works with a message queue indefinitely.
    example-
    ```sh
    $ python -m doyoumind.parsers run-parser 'pose' 'rabbitmq://127.0.0.1:5672/'
    ```

    **run-all-parsers-** a new CLI function. Runs as a service *all* available parsers (given that the server supports all their required fields), working with a message queue indefinitely.
    example-
    ```sh
    $ python -m doyoumind.parsers run-all-parsers 'rabbitmq://127.0.0.1:5672/'
    ```

    _**Q: I want to add a new parser. What should I do?**_
    Glad you asked!

    If you want to parse a new topic, X:
    -In the 'parsers' package, add a new file called X.py.
    -In it, add a function called parse_X. This function should take as input a Context object (representing a directory) and snapshot data, and return the parsed data. 
    The result is a json dictionary, with the keys:
    'parser': the name of the parsed topic (X).
    '[X]': the actual result of the parse, to be saved in the database.
    'user_id': the user's id.
    -parse_X.fields should be all the snapshot fields required for parsing X.

    When running the pipeline, the new parser will be dynamically added to the program and be parsed in its own topic in the mq.

    In order to make the parse result appear in the GUI, you should also add a new 'render_X' function in the render_topic.js script.

- `saver`
















The `foobar` package also provides a command-line interface:

```sh
$ python -m foobar
foobar, version 0.1.0
```

All commands accept the `-q` or `--quiet` flag to suppress output, and the `-t`
or `--traceback` flag to show the full traceback when an exception is raised
(by default, only the error message is printed, and the program exits with a
non-zero code).

The CLI provides the `foo` command, with the `run`, `add` and `inc`
subcommands:

```sh
$ python -m foobar foo run
foo
$ python -m foobar foo inc 1
2
$ python -m foobar foo add 1 2
3
```

The CLI further provides the `bar` command, with the `run` and `error`
subcommands.

Curiously enough, `bar`'s `run` subcommand accepts the `-o` or `--output`
option to write its output to a file rather than the standard output, and the
`-u` or `--uppercase` option to do so in uppercase letters.

```sh
$ python -m foobar bar run
bar
$ python -m foobar bar run -u
BAR
$ python -m foobar bar run -o output.txt
$ cat output.txt
BAR
```

Do note that each command's options should be passed to *that* command, so for
example the `-q` and `-t` options should be passed to `foobar`, not `foo` or
`bar`.

```sh
$ python -m foobar bar run -q # this doesn't work
ERROR: no such option: -q
$ python -m foobar -q bar run # this does work
```

To showcase these options, consider `bar`'s `error` subcommand, which raises an
exception:

```sh
$ python -m foobar bar error
ERROR: something went terribly wrong :[
$ python -m foobar -q bar error # suppress output
$ python -m foobar -t bar error # show full traceback
ERROR: something went terribly wrong :[
Traceback (most recent call last):
    ...
RuntimeError: something went terrible wrong :[
```
